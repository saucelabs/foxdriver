import { stub } from 'sinon'

import HeapSnapshotFile from '../lib/domains/heapSnapshotFile'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const heapSnapshotFile = new HeapSnapshotFile(client, 'server1.conn1.child6/heapSnapshotFile', {
    actor: 'server1.conn1.child6/heapSnapshotFile'
})

test('can return heap snap shot', () => {
    heapSnapshotFile.getHeapSnapshot(123)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/heapSnapshotFile', type: 'transferHeapSnapshot', snapshotId: 123}
    )).toEqual(true)
})
