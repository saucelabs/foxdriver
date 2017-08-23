import Actor from '../actor'
import Request from '../models/request'

export default class Network extends Actor {
    static listeners = ['NetworkActivity']

    constructor (client, name) {
        super(client, name)

        this.on('networkEvent', (event) => {
            const request = new Request(client, event.eventActor)
            this.emit('request', request)
        })
    }

    /**
     * Start the given Network listeners.
     *
     * @param array listeners
     *        Array of listeners you want to start. See Network.listeners for
     *        known listeners.
     */
    startListeners () {
        this.isEnabled = true
        return this.request('startListeners', { listeners: Network.listeners })
    }

    /**
     * Stop the given Web Console listeners.
     *
     * @param array listeners
     *        Array of listeners you want to stop. See Network.listeners for
     *        known listeners.
     */
    stopListeners () {
        this.isEnabled = false
        return this.request('stopListeners', { listeners: Network.listeners })
    }

    /**
     * Send a HTTP request with the given data.
     *
     * @param string data
     *        The details of the HTTP request.
     */
    sendHTTPRequest (request) {
        return this.request('sendHTTPRequest', { request })
    }
}
