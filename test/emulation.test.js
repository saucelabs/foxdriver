import { stub } from 'sinon'

import EmulationActor from '../lib/domains/emulation'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const emulation = new EmulationActor(client, 'server1.conn1.child6/emulation1', {
    actor: 'server1.conn1.child6/emulation1'
})

test('can overwrite dppx', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.setDPPXOverride(123)).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'setDPPXOverride', dppx: 123}
    )).toEqual(true)
})

test('can get ddpx overwrite', async () => {
    client.makeRequest.returns({ dppx: 'foobar' })

    expect(await emulation.getDPPXOverride()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'getDPPXOverride'}
    )).toEqual(true)
})

test('can clear ddpx overwrite', () => {
    emulation.clearDPPXOverride()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'clearDPPXOverride'}
    )).toEqual(true)
})

test('can set network throtteling', async () => {
    const options = {
        offline: false,
        latency: 0, // ms
        downloadThroughput: 75000, // byte/s
        uploadThroughput: 25000, // byte/s
        connectionType: 'cellular3g'
    }
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.setNetworkThrottling(options)).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'setNetworkThrottling', options}
    )).toEqual(true)
})

test('can get network throtteling', async () => {
    client.makeRequest.returns({ state: 'foobar' })

    expect(await emulation.getNetworkThrottling()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'getNetworkThrottling'}
    )).toEqual(true)
})

test('can clear network throtteling', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.clearNetworkThrottling()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'clearNetworkThrottling'}
    )).toEqual(true)
})

test('can set touch events overwrites', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.setTouchEventsOverride(true)).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'setTouchEventsOverride', flag: true}
    )).toEqual(true)
})

test('can get touch events overwrites', async () => {
    client.makeRequest.returns({ flag: true })

    expect(await emulation.getTouchEventsOverride()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'getTouchEventsOverride'}
    )).toEqual(true)
})

test('can clear touch events overwrites', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.clearTouchEventsOverride()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'clearTouchEventsOverride'}
    )).toEqual(true)
})

test('can set user agent overwrites', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.setUserAgentOverride({ userAgent: 'foobar' })).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'setUserAgentOverride', flag: { userAgent: 'foobar' }}
    )).toEqual(true)
})

test('can get touch events overwrites', async () => {
    client.makeRequest.returns({ userAgent: 'foobar' })

    expect(await emulation.getUserAgentOverride()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'getUserAgentOverride'}
    )).toEqual(true)
})

test('can clear touch events overwrites', async () => {
    client.makeRequest.returns({ valueChanged: true })

    expect(await emulation.clearUserAgentOverride()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/emulation1', type: 'clearUserAgentOverride'}
    )).toEqual(true)
})
