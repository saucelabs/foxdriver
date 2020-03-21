import net from 'net'
import { EventEmitter } from 'events'
import { Buffer } from 'safe-buffer'

import logger from './logger'

const UNSOLICITED_EVENTS = [
    'tabNavigated', 'styleApplied', 'propertyChange', 'networkEventUpdate', 'networkEvent',
    'propertyChange', 'newMutations', 'appOpen', 'appClose', 'appInstall', 'appUninstall',
    'frameUpdate', 'tabListChanged'
]

/**
 * a Client object handles connecting with a Firefox remote debugging
 * server instance (e.g. a Firefox instance), plus sending and receiving
 * packets on that conection using the Firefox remote debugging protocol.
 *
 * Important methods:
 * connect - Create the connection to the server.
 * makeRequest - Make a request to the server with a JSON message,
 *   and a callback to call with the response.
 *
 * Important events:
 * 'message' - An unsolicited (e.g. not a response to a prior request)
 *    packet has been received. These packets usually describe events.
 *
 * This code was adapted from https://github.com/harthur/firefox-client
 */
export default class Client extends EventEmitter {
    constructor (host, port) {
        super()
        this.host = host
        this.port = port
        this.incoming = Buffer.from('')
        this.log = logger('Client')
        this.supportedDomains = []

        this._pendingRequests = []
        this._activeRequests = {}
    }

    /**
     * create socket connection
     *
     * @return {Promise}  resolves once connected to socket
     */
    connect () {
        this.socket = net.createConnection({
            host: this.host,
            port: this.port
        })

        this.socket.on('data', ::this.onData)
        this.socket.on('error', ::this.onError)
        this.socket.on('end', ::this.onEnd)
        this.socket.on('timeout', ::this.onTimeout)

        return new Promise((resolve) => this.socket.on('connect', resolve))
    }

    /**
     * end socket connection
     */
    disconnect () {
        if (!this.socket) {
            return
        }
        this.socket.destroy()
        this.socket.unref()
    }

    /**
     * Called when a new data chunk is received on the connection.
     * Parse data into message(s) and call message handler for any full
     * messages that are read in.
     */
    onData (data) {
        this.incoming = Buffer.concat([this.incoming, data])
        while (this.readMessage()) {}
    }

    /**
     * Parse out and process the next message from the data read from
     * the connection. Returns true if a full meassage was parsed, false
     * otherwise.
     */
    readMessage () {
        var sep = this.incoming.toString().indexOf(':')

        if (sep < 0) {
            return false
        }

        /**
         * beginning of a message is preceded by byteLength(message) + ":"
         */
        const count = parseInt(this.incoming.slice(0, sep))

        /**
         * check if response is complete
         */
        if (this.incoming.length - (sep + 1) < count) {
            return false
        }

        this.incoming = this.incoming.slice(sep + 1)
        const packet = this.incoming.slice(0, count)
        this.incoming = this.incoming.slice(count)
        this.handleMessage(packet)
        return true
    }

    /**
     * Handler for a new message coming in. It's either an unsolicited event
     * from the server, or a response to a previous request from the client.
     */
    handleMessage (packet) {
        let message

        try {
            message = JSON.parse(packet.toString())
        } catch (e) {
            return this.log.error(`Couldn't parse packet from server as JSON ${e}, message:\n${packet}`)
        }

        if (!message.from) {
            if (message.error) {
                return this.log.error(message.message)
            }

            return this.log.error(`Server didn't specify an actor: ${packet}`)
        }

        /**
         * respond to request
         */
        if (!UNSOLICITED_EVENTS.includes(message.type) && this._activeRequests[message.from]) {
            this.emit('message', message)
            this.log.info(`response: ${packet}`)
            const callback = this._activeRequests[message.from]
            delete this._activeRequests[message.from]
            callback(message)
            return this._flushRequests()
        }

        /**
         * handle unsolicited event from server
         */
        if (message.type) {
            // this is an unsolicited event from the server
            this.log.info(`unsolicited event: ${packet}`)
            return this.emit('message', message)
        }

        this.log.error(`Unhandled message: ${JSON.stringify(message)}`)
    }

    /**
     * Send a JSON message over the connection to the server.
     */
    sendMessage (message) {
        if (!message.to) {
            throw new Error('No actor specified in request')
        }

        if (!this.socket) {
            throw new Error('Not connected, connect() before sending requests')
        }

        let str = JSON.stringify(message)
        this.emit('send', message)

        /**
         * message is preceded by byteLength(message):
         */
        str = `${(Buffer.from(str)).length}:${str}`

        try {
            this.socket.write(str)
        } catch (e) {
            this.log.error(`Couldn't set socket message: ${e.message}`)
        }
    }

    /**
     * Set a request to be sent to an actor on the server. If the actor
     * is already handling a request, queue this request until the actor
     * has responded to the previous request.
     *
     * @param {object} request
     *        Message to be JSON-ified and sent to server.
     * @param {function} callback
     *        Function that's called with the response from the server.
     */
    makeRequest (request) {
        this.log.info(`request: ${JSON.stringify(request)}`)

        if (!request.to) {
            throw new Error(`${request.type || ''} request packet has no destination.`)
        }

        let resolveCb
        const resp = new Promise((resolve) => { resolveCb = resolve })
        this._pendingRequests.push({ to: request.to, message: request, callback: resolveCb })
        this._flushRequests()

        return resp
    }

    /**
     * Activate (send) any pending requests to actors that don't have an
     * active request.
     */
    _flushRequests () {
        this._pendingRequests = this._pendingRequests.filter((request) => {
            /**
             * only one active request per actor at a time
             */
            if (this._activeRequests[request.to]) {
                return true
            }

            /**
             * no active requests for this actor, so activate this one
             */
            this.sendMessage(request.message)
            this.expectReply(request.to, request.callback)

            /**
             * remove from pending requests
             */
            return false
        })
    }

    /**
     * Arrange to hand the next reply from |actor| to |handler|.
     */
    expectReply (actor, handler) {
        if (this._activeRequests[actor]) {
            throw Error(`clashing handlers for next reply from ${actor}`)
        }
        this._activeRequests[actor] = handler
    }

    onError (error) {
        var code = error.code ? error.code : error
        this.log.error(`connection error: ${code}`)
        this.emit('error', error)
    }

    onEnd () {
        this.log.info('connection closed by server')
        this.emit('end')
    }

    onTimeout () {
        this.log.info('connection timeout')
        this.emit('timeout')
    }
}
