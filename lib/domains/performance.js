import Actor from '../actor'

/**
 * This actor wraps the Performance module at devtools/shared/shared/performance.js
 * and provides RDP definitions.
 *
 * @see devtools/shared/shared/performance.js for documentation.
 */
export default class Performance extends Actor {
    connect (options) {
        return this.request('connect', { options })
    }

    /**
     * Checks whether or not a new recording is supported by the PerformanceFront.
     *
     * @return {Promise.Boolean}  true if it can record performance
     */
    async canCurrentlyRecord (options) {
        const { value } = await this.request('canCurrentlyRecord')
        return value
    }

    /**
     * Begins a recording session.
     *
     * @param  {Boolean}  options.withMarkers
     *                    include markers
     * @param  {Boolean}  options.withTicks
     *                    include ticks
     * @param  {Boolean}  options.withMemory
     *                    include memory
     * @param  {Boolean}  options.withAllocations
     *                    include allocations
     * @param  {Boolean}  options.allocationsSampleProbability
     *                    include allocation sample probability
     * @param  {Boolean}  options.allocationsMaxLogLength
     *                    include allocations max log length
     * @param  {Boolean}  options.bufferSize
     *                    include buffer size
     * @param  {Boolean}  options.sampleFrequency
     *                    include sample frequency
     * @param  {Boolean}  options.console
     *                    include console
     * @param  {String}   options.label
     *                    label of session recording
     * @param  {Boolean}  options.realtimeMarkers
     *                    use real time markers
     *
     * @return {Promise.<Object>} A promise that is resolved once recording has started.
     */
    async startRecording (options) {
        const { recording } = await this.request('startRecording', { options })
        return recording
    }

    /**
     * Manually ends the recording session for the corresponding PerformanceRecording.
     *
     * @param {PerformanceRecording} model
     *        The corresponding PerformanceRecording that belongs to the recording
     *        session wished to stop.
     * @return {Promise.PerformanceRecording}
     *         Returns the same model, populated with the profiling data.
     */
    async stopRecording (options) {
        const { recording } = await this.request('stopRecording', { options })
        return recording
    }

    /**
     * Checks all currently stored recording handles and returns a boolean
     * if there is a session currently being recorded.
     *
     * @return {Boolean} true if actor is currently recording
     */
    async isRecording () {
        const { isRecording } = await this.request('isRecording')
        return isRecording
    }

    /**
     * Returns all current recordings.
     * @return {Promise.PerformanceRecording}  returns model with populated profing data
     */
    async getRecordings () {
        const { recordings } = await this.request('getRecordings')
        return recordings
    }

    /**
     * Returns the configurations set on underlying components, used in tests.
     * Returns an object with `probability`, `maxLogLength` for allocations, and
     * `features`, `threadFilters`, `entries` and `interval` for profiler.
     *
     * @return {Promise.Object}
     */
    async getConfiguration () {
        const { config } = await this.request('getConfiguration')
        return config
    }
}
