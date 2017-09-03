import { stub } from 'sinon'

import Request from '../lib/models/request'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const request = new Request(client, { actor: 'server1.conn1.child6/request1' })

test('can get request headers', () => {
    request.getRequestHeaders()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getRequestHeaders'}
    )).toEqual(true)
})

test('can get request cookies', () => {
    request.getRequestCookies()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getRequestCookies'}
    )).toEqual(true)
})

test('can get request post data', () => {
    request.getRequestPostData()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getRequestPostData'}
    )).toEqual(true)
})

test('can get response headers', () => {
    request.getResponseHeaders()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getResponseHeaders'}
    )).toEqual(true)
})

test('can get response cookies', () => {
    request.getResponseCookies()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getResponseCookies'}
    )).toEqual(true)
})

test('can get response content', () => {
    request.getResponseContent()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getResponseContent'}
    )).toEqual(true)
})

test('can get event timings', () => {
    request.getEventTimings()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getEventTimings'}
    )).toEqual(true)
})

test('can get response start', () => {
    request.getResponseStart()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getResponseStart'}
    )).toEqual(true)
})

test('can get security info', () => {
    request.getSecurityInfo()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/request1', type: 'getSecurityInfo'}
    )).toEqual(true)
})

test('propagates event updates', (done) => {
    request.on('onEventTimings', (e) => {
        expect(e.updateType).toEqual('eventTimings')
        expect(e.totalTime).toEqual(75)
        done()
    })

    request.emit('networkEventUpdate', {
        from: 'server1.conn47.child1/netEvent34',
        type: 'networkEventUpdate',
        updateType: 'eventTimings',
        totalTime: 75
    })
})
