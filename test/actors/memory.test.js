import { stub } from 'sinon'

import Memory from '../../lib/domains/memory'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const memory = new Memory(client, 'server1.conn1.child6/memory1', {
    actor: 'server1.conn1.child6/memory1'
})

test('is detached to begin with', () => {
    expect(memory.isAttached).toEqual(false)
})

test('can attach', () => {
    memory.attach()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'attach'}
    )).toEqual(true)
    expect(memory.isAttached).toEqual(true)
})

test('can detach', () => {
    memory.detach()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'detach'}
    )).toEqual(true)
    expect(memory.isAttached).toEqual(false)
})

test('can get attachment state', async () => {
    client.makeRequest.returns({ state: 'attached' })

    await memory.getState()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'getState'}
    )).toEqual(true)
    expect(memory.isAttached).toEqual(true)
})

test('can take census', () => {
    memory.isAttached = false
    expect(::memory.takeCensus).toThrow()
    memory.isAttached = true

    memory.takeCensus()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'takeCensus'}
    )).toEqual(true)
})

test('can start recording allocations', async () => {
    client.makeRequest.returns({ value: 'foobar' })
    memory.isAttached = false
    expect(memory.startRecordingAllocations()).rejects.toBeDefined()
    memory.isAttached = true

    expect(await memory.startRecordingAllocations({ foo: 'bar' })).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'startRecordingAllocations', options: { foo: 'bar' }}
    )).toEqual(true)
})

test('can stop recording allocations', async () => {
    client.makeRequest.returns({ value: 'foobar' })
    memory.isAttached = false
    expect(memory.stopRecordingAllocations()).rejects.toBeDefined()
    memory.isAttached = true

    expect(await memory.stopRecordingAllocations()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'stopRecordingAllocations'}
    )).toEqual(true)
})

test('can get allocations settings', async () => {
    client.makeRequest.returns({ options: { foo: 'bar' } })
    memory.isAttached = false
    expect(memory.getAllocationsSettings()).rejects.toBeDefined()
    memory.isAttached = true

    expect(await memory.getAllocationsSettings()).toEqual({ foo: 'bar' })
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'getAllocationsSettings'}
    )).toEqual(true)
})

test('can get allocations', () => {
    memory.isAttached = false
    expect(::memory.getAllocations).toThrow()
    memory.isAttached = true

    memory.getAllocations()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'getAllocations'}
    )).toEqual(true)
})

test('can force garbage collection', () => {
    memory.isAttached = false
    expect(::memory.forceGarbageCollection).toThrow()
    memory.isAttached = true

    memory.forceGarbageCollection()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'forceGarbageCollection'}
    )).toEqual(true)
})

test('can force cycle collection', () => {
    memory.isAttached = false
    expect(::memory.forceCycleCollection).toThrow()
    memory.isAttached = true

    memory.forceCycleCollection()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'forceCycleCollection'}
    )).toEqual(true)
})

test('can measure', () => {
    memory.measure()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'measure'}
    )).toEqual(true)
})

test('can save heap snapshot file', async () => {
    client.makeRequest.returns({ snapshotId: 321 })
    const boundaries = {
        x: 1,
        y: 2
    }

    memory.isAttached = false
    expect(memory.saveHeapSnapshot(boundaries)).rejects.toBeDefined()
    memory.isAttached = true

    expect(await memory.saveHeapSnapshot(boundaries)).toEqual(321)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/memory1', type: 'saveHeapSnapshot', boundaries}
    )).toEqual(true)
})
