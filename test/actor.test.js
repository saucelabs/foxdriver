import EventEmitter from 'events'
import { stub } from 'sinon'

import Tab from '../lib/tab'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = new EventEmitter()
client.makeRequest = stub()

const tab = new Tab(client, 'server1.conn1.child6/tab1', {
    actor: 'sometab'
})

test('requests correctly', async () => {
    client.makeRequest.returns({foo: 'bar'})
    const result = await tab.navigateTo(1, 2, 3)
    expect(result).toHaveProperty('foo')
    expect(result.foo).toEqual('bar')
})

test('detects error', async () => {
    client.makeRequest.returns({ error: 'bar', message: 'foo' })
    return expect(tab.navigateTo(1, 2, 3)).rejects.toBeDefined()
})

test('catches right events', (done) => {
    tab.on('foobar', (a) => {
        expect(a.data).toBe('yeahh')
        done()
    })
    client.emit('message', { from: 'no one', type: 'foobar' })
    client.emit('message', { from: 'server1.conn1.child6/tab1', data: 'yeahh', type: 'foobar' })
})
