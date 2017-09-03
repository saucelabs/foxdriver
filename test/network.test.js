import { stub } from 'sinon'

import Network from '../lib/domains/network'
import Request from '../lib/models/request'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const network = new Network(client, 'server1.conn1.child6/network1', {
    actor: 'server1.conn1.child6/network1'
})

test('is disabled in the first place', () => {
    expect(network.isEnabled).toEqual(false)
})

test('emits request events', (done) => {
    network.on('request', (request) => {
        expect(request).toBeInstanceOf(Request)
        done()
    })

    network.emit('networkEvent', {
        eventActor: {
            from: 'server1.conn47.child1/netEvent34',
            type: 'networkEventUpdate',
            updateType: 'eventTimings',
            totalTime: 75
        }
    })
})

test('can start listeners', async () => {
    await network.startListeners()

    expect(network.isEnabled).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/network1', type: 'startListeners', listeners: ['NetworkActivity']}
    )).toEqual(true)
})

test('can stop listeners', async () => {
    await network.stopListeners()

    expect(network.isEnabled).toEqual(false)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/network1', type: 'stopListeners', listeners: ['NetworkActivity']}
    )).toEqual(true)
})

test('can send http request', async () => {
    await network.sendHTTPRequest({ data: 'foobar' })
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/network1', type: 'sendHTTPRequest', request: { data: 'foobar' }}
    )).toEqual(true)
})
