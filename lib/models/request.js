import Actor from '../actor'

export default class Request extends Actor {
    constructor (client, event) {
        super(client, event.actor)

        this.startedDateTime = event.startedDateTime
        this.timeStamp = event.timeStamp
        this.url = event.url
        this.method = event.method
        this.isXHR = event.isXHR
        this.fromCache = event.fromCache
        this.cause = event.cause
        this.private = event.private

        this.on('networkEventUpdate', ::this.onUpdate)
    }

    /**
     * Retrieve the request headers from the given NetworkEventActor.
     */
    getRequestHeaders () {
        return this.request('getRequestHeaders')
    }

    /**
     * Retrieve the request cookies from the given NetworkEventActor.
     */
    getRequestCookies () {
        return this.request('getRequestCookies')
    }

    /**
     * Retrieve the request post data from the given NetworkEventActor.
     */
    getRequestPostData () {
        return this.request('getRequestPostData')
    }

    /**
     * Retrieve the response headers from the given NetworkEventActor.
     */
    getResponseHeaders () {
        return this.request('getResponseHeaders')
    }

    /**
     * Retrieve the response cookies from the given NetworkEventActor.
     */
    getResponseCookies () {
        return this.request('getResponseCookies')
    }

    /**
     * Retrieve the response content from the given NetworkEventActor.
     */
    getResponseContent () {
        return this.request('getResponseContent')
    }

    /**
     * Retrieve the timing information for the given NetworkEventActor.
     */
    getEventTimings () {
        return this.request('getEventTimings')
    }

    getResponseStart () {
        return this.request('getResponseStart')
    }

    onUpdate (e) {
        const type = `on${e.updateType[0].toUpperCase()}${e.updateType.slice(1)}`
        this.emit(type, e)
    }

    /**
     * Retrieve the security information for the given NetworkEventActor.
     */
    getSecurityInfo () {
        return this.request('getSecurityInfo')
    }
}
