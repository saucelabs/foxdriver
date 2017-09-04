import Actor from '../actor'

/**
 * An actor that returns memory usage data for its parent actor's window. A tab-scoped instance
 * of this actor will measure the memory footprint of its parent tab. A global-scoped instance
 * however, will measure the memory footprint of the chrome window referenced by the root actor.
 *
 * This actor wraps the Memory module at devtools/server/performance/memory.js
 * and provides RDP definitions.
 */
export default class Memory extends Actor {
    constructor (client, name) {
        super(client, name)
        this.isAttached = false
    }

    /**
     * Attach to this MemoryBridge.
     *
     * This attaches the MemoryBridge's Debugger instance so that you can start
     * recording allocations or take a census of the heap. In addition, the
     * MemoryBridge will start emitting GC events.
     *
     * @return {Promise}  request response
     */
    attach () {
        this.isAttached = true
        return this.request('attach')
    }

    /**
     * Detach from this MemoryBridge.
     *
     * @return {Promise}  request response
     */
    detach () {
        this.isAttached = false
        return this.request('detach')
    }

    /**
     * Gets the current MemoryBridge attach/detach state.
     *
     * @return {Promise.String}  attach/detach state
     */
    async getState () {
        const { state } = await this.request('getState')
        this.isAttached = state === 'attached'
        return state
    }

    /**
     * Take a census of the heap. See js/src/doc/Debugger/Debugger.Memory.md for more information.
     *
     * @return {Promise}  request response
     */
    takeCensus () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('takeCensus')
    }

    /**
     * Start recording allocation sites.
     *
     * @param {number} options.probability
     *                 The probability we sample any given allocation when recording
     *                 allocations. Must be between 0 and 1 -- defaults to 1.
     * @param {number} options.maxLogLength
     *                 The maximum number of allocation events to keep in the
     *                 log. If new allocs occur while at capacity, oldest
     *                 allocations are lost. Must fit in a 32 bit signed integer.
     * @param {number} options.drainAllocationsTimeout
     *                 A number in milliseconds of how often, at least, an `allocation`
     *                 event gets emitted (and drained), and also emits and drains on every
     *                 GC event, resetting the timer.
     * @return {Promise}  request response
     */
    async startRecordingAllocations (options) {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { value } = await this.request('startRecordingAllocations', { options })
        return value
    }

    /**
     * Stop recording allocation sites.
     *
     * @return {Promise}  request response
     */
    async stopRecordingAllocations () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { value } = await this.request('stopRecordingAllocations')
        return value
    }

    /**
     * Return settings used in `startRecordingAllocations` for `probability` and `maxLogLength`.
     * Currently only uses in tests.
     *
     * @return {Promise.Object}  allocation settings
     */
    async getAllocationsSettings () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { options } = await this.request('getAllocationsSettings')
        return options
    }

    /**
     * Get a list of the most recent allocations since the last time we got
     * allocations, as well as a summary of all allocations since we've been
     * recording.
     *
     * @returns {Object} An object of the form:
     *
     *   {
     *     allocations: [<index into "frames" below>, ...],
     *     allocationsTimestamps: [
     *       <timestamp for allocations[0]>,
     *       <timestamp for allocations[1]>,
     *       ...
     *     ],
     *     allocationSizes: [
     *       <bytesize for allocations[0]>,
     *       <bytesize for allocations[1]>,
     *       ...
     *     ],
     *     frames: [
     *       {
     *         line: <line number for this frame>,
     *         column: <column number for this frame>,
     *         source: <filename string for this frame>,
     *         functionDisplayName:
     *           <this frame's inferred function name function or null>,
     *         parent: <index into "frames">
     *       },
     *       ...
     *     ],
     *   }
     *
     * The timestamps' unit is microseconds since the epoch.
     *
     * Subsequent `getAllocations` request within the same recording and
     * tab navigation will always place the same stack frames at the same
     * indices as previous `getAllocations` requests in the same
     * recording. In other words, it is safe to use the index as a
     * unique, persistent id for its frame.
     *
     * Additionally, the root node (null) is always at index 0.
     *
     * We use the indices into the "frames" array to avoid repeating the
     * description of duplicate stack frames both when listing
     * allocations, and when many stacks share the same tail of older
     * frames. There shouldn't be any duplicates in the "frames" array,
     * as that would defeat the purpose of this compression trick.
     *
     * In the future, we might want to split out a frame's "source" and
     * "functionDisplayName" properties out the same way we have split
     * frames out with the "frames" array. While this would further
     * compress the size of the response packet, it would increase CPU
     * usage to build the packet, and it should, of course, be guided by
     * profiling and done only when necessary.
     */
    getAllocations () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('getAllocations')
    }

    /**
     * Force a browser-wide GC.
     *
     * @return {Promise.Object}  allocation settings
     */
    forceGarbageCollection () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('forceGarbageCollection')
    }

    /**
     * Force an XPCOM cycle collection. For more information on XPCOM cycle
     * collection, see https://developer.mozilla.org/en-US/docs/Interfacing_with_the_XPCOM_cycle_collector#What_the_cycle_collector_does
     *
     * @return {Promise.Object}  request response
     */
    forceCycleCollection () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('forceCycleCollection')
    }

    /**
     * A method that returns a detailed breakdown of the memory consumption of the
     * associated window.
     *
     * @return {Object}  memory consumption
     */
    measure () {
        return this.request('measure')
    }

    /**
     * Save a heap snapshot scoped to the current debuggees' portion of the heap
     * graph.
     *
     * @param {Object|null} boundaries
     * @return {String}     The snapshot id.
     */
    async saveHeapSnapshot (boundaries) {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { snapshotId } = await this.request('saveHeapSnapshot', { boundaries })
        return snapshotId
    }
}
