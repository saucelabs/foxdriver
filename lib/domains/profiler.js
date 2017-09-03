import Actor from '../actor'

export default class Profiler extends Actor {
    startProfiler (entries, interval, features, threadFilters) {
        return this.request('startProfiler', { entries, interval, features, threadFilters })
    }

    stopProfiler () {
        return this.request('stopProfiler')
    }

    getProfile (startTime, stringify) {
        return this.request('getProfile', { startTime, stringify })
    }

    async getFeatures () {
        const { features } = await this.request('getFeatures')
        return features
    }

    getBufferInfo () {
        return this.request('getBufferInfo')
    }

    getStartOptions () {
        return this.request('getStartOptions')
    }

    isActive () {
        return this.request('isActive')
    }

    sharedLibraries () {
        return this.request('sharedLibraries')
    }

    registerEventNotifications (events) {
        return this.request('registerEventNotifications', { events })
    }

    unregisterEventNotifications (events) {
        return this.request('unregisterEventNotifications', { events })
    }

    setProfilerStatusInterval (interval) {
        return this.request('setProfilerStatusInterval', { interval })
    }
}
