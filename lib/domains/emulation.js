import Actor from '../actor'

/**
 * This actor overrides various browser features to simulate different environments to
 * test how pages perform under various conditions.
 *
 * The design below, which saves the previous value of each property before setting, is
 * needed because it's possible to have multiple copies of this actor for a single page.
 * When some instance of this actor changes a property, we want it to be able to restore
 * that property to the way it was found before the change.
 *
 * A subtle aspect of the code below is that all get* methods must return non-undefined
 * values, so that the absence of a previous value can be distinguished from the value for
 * "no override" for each of the properties.
 */
export default class Emulation extends Actor {
    /**
     * overwrite DPPX value
     *
     * @param  {Nimber}  dppx     dppx value
     * @return {Promise.Boolean}  true if value has changed
     */
    async setDPPXOverride (dppx) {
        const { valueChanged } = await this.request('setDPPXOverride', { dppx })
        return valueChanged
    }

    /**
     * get current DPPX value
     *
     * @return {Promise.Number}  current dppx value
     */
    async getDPPXOverride () {
        const { dppx } = await this.request('getDPPXOverride')
        return dppx
    }

    /**
     * clear DPPX value
     *
     * @return {Promise.Boolean}  true if value has changed
     */
    async clearDPPXOverride () {
        const { valueChanged } = await this.request('clearDPPXOverride')
        return valueChanged
    }

    /**
     * Transform the RDP format into the internal format and then set network throttling.
     *
     * @param  {Number}  downloadThroughput  throughput in byte/s
     * @param  {Number}  uploadThroughput    throughput in byte/s
     * @param  {Number}  latency             latency time in ms
     * @return {Promise.Boolean}             true if value has changed
     */
    async setNetworkThrottling (downloadThroughput, uploadThroughput, latency) {
        const { valueChanged } = await this.request('setNetworkThrottling', {
            options: {
                downloadThroughput,
                uploadThroughput,
                latency
            }
        })
        return valueChanged
    }

    /**
     * Get network throttling and then transform the internal format into the RDP format.
     *
     * @return {Promise.<Object>}  state of current throttle
     */
    async getNetworkThrottling () {
        const { state } = await this.request('getNetworkThrottling')
        return state
    }

    /**
     * clear network throttling
     *
     * @return {Promise.Boolean}   true if value has changed
     */
    async clearNetworkThrottling () {
        const { valueChanged } = await this.request('clearNetworkThrottling')
        return valueChanged
    }

    /**
     * overwrite touch events
     *
     * @param  {Boolean}  flag    true if overwrite is enabled
     * @return {Promise.Boolean}  true if value has changed
     */
    async setTouchEventsOverride (flag) {
        const { valueChanged } = await this.request('setTouchEventsOverride', { flag })
        return valueChanged
    }

    /**
     * check if touch event overwrite is enabled
     *
     * @return {Promise.Boolean}  true if enabled
     */
    async getTouchEventsOverride () {
        const { flag } = await this.request('getTouchEventsOverride')
        return flag
    }

    /**
     * clear state of touch event overwrite
     *
     * @return {Promise.Boolean}  true if enabled
     */
    async clearTouchEventsOverride () {
        const { valueChanged } = await this.request('clearTouchEventsOverride')
        return valueChanged
    }

    /**
     * Overwrite user agent
     *
     * @param  {String}  userAgent  new user agent
     * @return {Promise.Boolean}    true if value has changed
     */
    async setUserAgentOverride (userAgent) {
        const { valueChanged } = await this.request('setUserAgentOverride', { flag: userAgent })
        return valueChanged
    }

    /**
     * Get current user agent overwrite
     *
     * @return {Promise.String}  current user agent
     */
    async getUserAgentOverride () {
        const { userAgent } = await this.request('getUserAgentOverride')
        return userAgent
    }

    /**
     * Clear user agent overwrite
     *
     * @return {Promise.Boolean}    true if value has changed
     */
    async clearUserAgentOverride () {
        const { valueChanged } = await this.request('clearUserAgentOverride')
        return valueChanged
    }
}
