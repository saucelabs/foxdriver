import Actor from '../actor'

export default class Emulation extends Actor {
    async setDPPXOverride (dppx) {
        const { valueChanged } = await this.request('setDPPXOverride', { dppx })
        return valueChanged
    }

    async getDPPXOverride () {
        const { dppx } = await this.request('getDPPXOverride')
        return dppx
    }

    async clearDPPXOverride () {
        const { valueChanged } = await this.request('clearDPPXOverride')
        return valueChanged
    }

    async setNetworkThrottling (options) {
        const { valueChanged } = await this.request('setNetworkThrottling', { options })
        return valueChanged
    }

    async getNetworkThrottling () {
        const { state } = await this.request('getNetworkThrottling')
        return state
    }

    async clearNetworkThrottling () {
        const { valueChanged } = await this.request('clearNetworkThrottling')
        return valueChanged
    }

    async setTouchEventsOverride (flag) {
        const { valueChanged } = await this.request('setTouchEventsOverride', { flag })
        return valueChanged
    }

    async getTouchEventsOverride () {
        const { flag } = await this.request('getTouchEventsOverride')
        return flag
    }

    async clearTouchEventsOverride () {
        const { valueChanged } = await this.request('clearTouchEventsOverride')
        return valueChanged
    }

    async setUserAgentOverride (flag) {
        const { valueChanged } = await this.request('setUserAgentOverride', { flag })
        return valueChanged
    }

    async getUserAgentOverride () {
        const { userAgent } = await this.request('getUserAgentOverride')
        return userAgent
    }

    async clearUserAgentOverride () {
        const { valueChanged } = await this.request('clearUserAgentOverride')
        return valueChanged
    }
}
