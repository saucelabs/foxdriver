import Actor from '../actor'

/**
 * The HeapSnapshotFileActor handles transferring heap snapshot files from the
 * server to the client. This has to be a global actor in the parent process
 * because child processes are sandboxed and do not have access to the file
 * system.
 */
export default class HeapSnapshotFile extends Actor {
    /**
     * transfer heap snapshot
     *
     * @param  {String} snapshotId  id of heap snapshot file
     * @return {Promise.<Object>}   request response
     */
    getHeapSnapshot (snapshotId) {
        return this.request('transferHeapSnapshot', { snapshotId })
    }
}
