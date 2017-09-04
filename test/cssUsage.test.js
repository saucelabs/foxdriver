import { stub } from 'sinon'

import CSSUsage from '../lib/domains/cssUsage'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const cssUsageActor = new CSSUsage(client, 'server1.conn1.child6/cssUsageActor1', {
    actor: 'server1.conn1.child6/cssUsageActor1'
})

test('can start actor', () => {
    cssUsageActor.start()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'start', url: false}
    )).toEqual(true)
})

test('can stop actor', () => {
    cssUsageActor.stop()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'stop'}
    )).toEqual(true)
})

test('can toggle', () => {
    cssUsageActor.toggle()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'toggle'}
    )).toEqual(true)
})

test('can take single shot', () => {
    cssUsageActor.oneshot()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'oneshot'}
    )).toEqual(true)
})

test('can create editor report', async () => {
    client.makeRequest.returns({ reports: 'foobar' })

    expect(await cssUsageActor.createEditorReport('test123')).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'createEditorReport', url: 'test123'}
    )).toEqual(true)
})

test('can create editor report for sheet', async () => {
    client.makeRequest.returns({ reports: 'foobar' })

    expect(await cssUsageActor.createEditorReportForSheet('test123')).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'createEditorReportForSheet', url: 'test123'}
    )).toEqual(true)
})

test('can create page report', () => {
    cssUsageActor.createPageReport('test123')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssUsageActor1', type: 'createPageReport'}
    )).toEqual(true)
})
