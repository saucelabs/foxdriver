import Actor from '../actor'

/**
 * The timeline actor pops and forwards timeline markers registered in docshells.
 */
export default class Timeline extends Actor {
    /**
     * Are we recording profile markers currently?
     *
     * @return {Promise.Boolean}  true if actor is profiling
     */
    async isRecording () {
        const { value } = await this.request('isRecording')
        return value
    }

    /**
     * Start recording profile markers.
     *
     * @param {Boolean} withMarkers
     *        Boolean indicating whether or not timeline markers are emitted
     *        once they're accumulated every `DEFAULT_TIMELINE_DATA_PULL_TIMEOUT`
     *        milliseconds.
     * @param {Boolean} withTicks
     *        Boolean indicating whether a `ticks` event is fired and a
     *        FramerateActor is created.
     * @param {Boolean} withMemory
     *        Boolean indiciating whether we want memory measurements sampled.
     * @param {Boolean} withFrames
     *        Boolean indicating whether or not stack frames should be handled
     *        from timeline markers.
     * @param {Boolean} withGCEvents
     *        Boolean indicating whether or not GC markers should be emitted.
     *        TODO: Remove these fake GC markers altogether in bug 1198127.
     * @param {Boolean} withDocLoadingEvents
     *        Boolean indicating whether or not DOMContentLoaded and Load
     *        marker events are emitted.
     * @return {Promise.Number}  start time of recording
     */
    async start (withMarkers, withTicks, withMemory, withFrames, withGCEvents, withDocLoadingEvents) {
        const { value } = await this.request('start', {
            withMarkers, withTicks, withMemory, withFrames, withGCEvents, withDocLoadingEvents
        })
        return value
    }

    /**
     * Stop recording profile markers.
     *
     * @return {Promise.Number}  end time of recording
     */
    async stop () {
        const { value } = await this.request('stop')
        return value
    }
}
