import { stub } from 'sinon'

import Performance from '../lib/domains/performance'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const performance = new Performance(client, 'server1.conn1.child6/performance1', {
    actor: 'server1.conn1.child6/performance1'
})

test('can connect', () => {
    const options = { foo: 'bar' }
    performance.connect(options)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'connect', options}
    )).toEqual(true)
})

test('can currently record', async () => {
    client.makeRequest.returns({ value: 'foobar' })
    expect(await performance.canCurrentlyRecord()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'canCurrentlyRecord'}
    )).toEqual(true)
})

test('can start recording', async () => {
    const options = { foo: 'bar' }

    client.makeRequest.returns({ recording: 'foobar' })
    expect(await performance.startRecording(options)).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'startRecording', options}
    )).toEqual(true)
})

test('can stop recording', async () => {
    const options = { foo: 'bar' }

    client.makeRequest.returns({ recording: 'foobar' })
    expect(await performance.stopRecording(options)).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'stopRecording', options}
    )).toEqual(true)
})

test('can check if browser records', async () => {
    client.makeRequest.returns({ isRecording: true })
    expect(await performance.isRecording()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'isRecording'}
    )).toEqual(true)
})

test('can get recordings', async () => {
    client.makeRequest.returns({ recordings: 'foobar' })
    expect(await performance.getRecordings()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'getRecordings'}
    )).toEqual(true)
})

test('can get configurations', async () => {
    client.makeRequest.returns({ config: 'foobar' })
    expect(await performance.getConfiguration()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/performance1', type: 'getConfiguration'}
    )).toEqual(true)
})
