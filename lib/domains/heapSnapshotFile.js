import Actor from '../actor'

export default class HeapSnapshotFile extends Actor {
    getHeapSnapshot (snapshotId) {
        return this.request('transferHeapSnapshot', { snapshotId })
    }
}
