import Actor from '../actor'
import LongString from './longString'

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
     * if this type is a LongString, call LongString to retrive the rest of the data
     * @returns {Promise.<String>}
     */
    async getRequestPostData () {
        const { postData } = await this.request('getRequestPostData')
        if (postData.text.type && postData.text.type === 'longString') {
            const longPost = new LongString(this.client, postData.text.actor)
            return longPost.substring(0, postData.text.length)
        }
        return postData.text
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
        const data = this.request('getResponseContent')
        if (data.content && data.content.text.type && data.content.text.type === 'longString') {
            const longPost = new LongString(this.client, data.content.text.actor)
            return longPost.substring(0, data.content.text.length)
        }
        return data
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
