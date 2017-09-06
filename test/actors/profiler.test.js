import { stub } from 'sinon'

import Profiler from '../../lib/domains/profiler'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const profiler = new Profiler(client, 'server1.conn1.child6/profiler1', {
    actor: 'server1.conn1.child6/profiler1'
})

test('can start profiler', () => {
    profiler.startProfiler(1, 2, 3, 4)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/profiler1',
        type: 'startProfiler',
        entries: 1,
        interval: 2,
        features: 3,
        threadFilters: 4
    })).toEqual(true)
})

test('can stop profiler', () => {
    profiler.stopProfiler()
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/profiler1',
        type: 'stopProfiler'
    })).toEqual(true)
})

test('can get profile', () => {
    const startTime = 1234
    const stringify = true
    profiler.getProfile(startTime, stringify)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/profiler1',
        type: 'getProfile',
        startTime,
        stringify
    })).toEqual(true)
})

test('can get features', async () => {
    client.makeRequest.returns({ features: 'foobar' })

    expect(await profiler.getFeatures()).toEqual('foobar')
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/profiler1',
        type: 'getFeatures'
    })).toEqual(true)
})

test('can get buffer info', () => {
    profiler.getBufferInfo()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'getBufferInfo'}
    )).toEqual(true)
})

test('can get start options', () => {
    profiler.getStartOptions()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'getStartOptions'}
    )).toEqual(true)
})

test('can check if active', () => {
    profiler.isActive()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'isActive'}
    )).toEqual(true)
})

test('can get shared libraries', () => {
    profiler.sharedLibraries()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'sharedLibraries'}
    )).toEqual(true)
})

test('can register event notifications', () => {
    const events = { data: 'foobar' }
    profiler.registerEventNotifications(events)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'registerEventNotifications', events}
    )).toEqual(true)
})

test('can unregister event notifications', () => {
    const events = { data: 'foobar' }
    profiler.unregisterEventNotifications(events)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'unregisterEventNotifications', events}
    )).toEqual(true)
})

test('can get profiler status interval', () => {
    profiler.setProfilerStatusInterval(123)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/profiler1', type: 'setProfilerStatusInterval', interval: 123}
    )).toEqual(true)
})
