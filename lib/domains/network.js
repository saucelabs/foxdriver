import Actor from '../actor'
import Request from '../models/request'

export default class Network extends Actor {
    static listeners = ['NetworkActivity']

    constructor (client, name) {
        super(client, name)
        this.isEnabled = false

        this.on('networkEvent', (event) => {
            const request = new Request(client, event.eventActor)
            this.emit('request', request)
        })
    }

    /**
     * Start the given Network listeners.
     *
     * @param  {String[]} listeners  console listeners to listen to (default: NetworkActivity)
     * @return {Promise}             resolves once request has finished
     */
    startListeners (listeners = Network.listeners) {
        this.isEnabled = true
        return this.request('startListeners', { listeners })
    }

    /**
     * Stop the given Web Console listeners.
     *
     * @param  {String[]} listeners  console listeners to stop listen to (default: NetworkActivity)
     * @return {Promise}             resolves once request has finished
     */
    stopListeners (listeners = Network.listeners) {
        this.isEnabled = false
        return this.request('stopListeners', { listeners })
    }

    /**
     * Send a HTTP request with the given data.
     * @param  {Request} request  The details of the HTTP request
     * @return {Promise}          resolves once request has finished
     */
    sendHTTPRequest (request) {
        return this.request('sendHTTPRequest', { request })
    }
}
