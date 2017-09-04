import Actor from '../actor'

/**
 * Main interface for interacting with nsIProfiler
 */
export default class Profiler extends Actor {
    /**
     * Starts the nsIProfiler module. Doing so will discard any samples
     * that might have been accumulated so far.
     *
     * @param {Number} entries               number of entries
     * @param {Number} interval              recording interval
     * @param {Array<String>} features       list of features to include
     * @param {Array<String>} threadFilters  list of thread filters
     *
     * @return {Promise.Object}              request response
     */
    startProfiler (entries, interval, features, threadFilters) {
        return this.request('startProfiler', { entries, interval, features, threadFilters })
    }

    /**
     * Attempts to stop the nsIProfiler module.
     * @return {Promise.Object}  request response
     */
    stopProfiler () {
        return this.request('stopProfiler')
    }

    /**
     * Returns all the samples accumulated since the profiler was started,
     * along with the current time. The data has the following format:
     * {
     *   libs: string,
     *   meta: {
     *     interval: number,
     *     platform: string,
     *     ...
     *   },
     *   threads: [{
     *     samples: [{
     *       frames: [{
     *         line: number,
     *         location: string,
     *         category: number
     *       } ... ],
     *       name: string
     *       responsiveness: number
     *       time: number
     *     } ... ]
     *   } ... ]
     * }
     *
     *
     * @param {Number} startTime
     *        Since the circular buffer will only grow as long as the profiler lives,
     *        the buffer can contain unwanted samples. Pass in a `startTime` to only
     *        retrieve samples that took place after the `startTime`, with 0 being
     *        when the profiler just started.
     * @param {Boolean} stringify
     *        Whether or not the returned profile object should be a string or not to
     *        save JSON parse/stringify cycle if emitting over RDP.
     */
    getProfile (startTime, stringify) {
        return this.request('getProfile', { startTime, stringify })
    }

    /**
     * Returns an array of feature strings, describing the profiler features
     * that are available on this platform. Can be called while the profiler
     * is stopped.
     *
     * @return {Promise.String[]}  list of feature strings
     */
    async getFeatures () {
        const { features } = await this.request('getFeatures')
        return features
    }

    /**
     * Returns an object with the values of the current status of the
     * circular buffer in the profiler, returning `position`, `totalSize`,
     * and the current `generation` of the buffer.
     *
     * @return {Promise.Object}  current status of the circular buffer
     */
    getBufferInfo () {
        return this.request('getBufferInfo')
    }

    /**
     * Returns the configuration used that was originally passed in to start up the
     * profiler. Used for tests, and does not account for others using nsIProfiler.
     *
     * @return {Promise.Object}  profiler configurations
     */
    getStartOptions () {
        return this.request('getStartOptions')
    }

    /**
     * Verifies whether or not the nsIProfiler module has started.
     * If already active, the current time is also returned.
     *
     * @return {Promise.Boolean}  true if nsIProfiler module has started
     */
    isActive () {
        return this.request('isActive')
    }

    /**
     * Returns an array of objects that describes the shared libraries
     * which are currently loaded into our process. Can be called while the
     * profiler is stopped.
     *
     * @return {Promise.Object[]}  list of objects that describes the shared libraries
     */
    sharedLibraries () {
        return this.request('sharedLibraries')
    }

    /**
     * Registers handlers for the following events to be emitted
     * on active Profiler instances:
     *   - "console-api-profiler"
     *   - "profiler-started"
     *   - "profiler-stopped"
     *   - "profiler-status"
     *
     * The ProfilerManager listens to all events, and individual
     * consumers filter which events they are interested in.
     *
     * @param  {String[]} events  events to listen to
     * @return {Promise}          request response
     */
    registerEventNotifications (events) {
        return this.request('registerEventNotifications', { events })
    }

    /**
     * Unregisters handlers for all system events.
     *
     * @param  {String[]} events  events to unregister of
     * @return {Promise}          request response
     */
    unregisterEventNotifications (events) {
        return this.request('unregisterEventNotifications', { events })
    }

    /**
     * Updates the frequency that the "profiler-status" event is emitted
     * during recording.
     *
     * @param {Number} interval  interval of recording
     */
    setProfilerStatusInterval (interval) {
        return this.request('setProfilerStatusInterval', { interval })
    }
}
