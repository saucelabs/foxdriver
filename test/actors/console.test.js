import { stub } from 'sinon'

import ConsoleActor from '../../lib/domains/console'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const consoleActor = new ConsoleActor(client, 'server1.conn1.child6/console1', {
    actor: 'server1.conn1.child6/console1'
})

test('can start listening to console events', () => {
    consoleActor.startListeners()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'startListeners', listeners: ['PageError', 'ConsoleAPI']}
    )).toEqual(true)

    consoleActor.startListeners(['foobar'])
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'startListeners', listeners: ['foobar']}
    )).toEqual(true)
})

it('can stop listening', () => {
    consoleActor.stopListeners()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'stopListeners', listeners: ['PageError', 'ConsoleAPI']}
    )).toEqual(true)

    consoleActor.stopListeners(['foobar'])
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'stopListeners', listeners: ['foobar']}
    )).toEqual(true)
})

it('can get cached messages if listener was started before', async () => {
    let err
    try {
        await consoleActor.getCachedMessages()
    } catch (e) {
        err = e
    }

    expect(err).toBeDefined()
    expect(err.message).toEqual('Console is not enabled')
})

it('can get cached messages', () => {
    consoleActor.startListeners()
    consoleActor.getCachedMessages()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'getCachedMessages', messageTypes: ['PageError', 'ConsoleAPI']}
    )).toEqual(true)

    consoleActor.getCachedMessages(['foobar'])
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'getCachedMessages', messageTypes: ['foobar']}
    )).toEqual(true)
})

it('can clear messages', () => {
    consoleActor.clearMessagesCache()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'clearMessagesCache'}
    )).toEqual(true)
})

it('can evaluate JS', () => {
    consoleActor.evaluateJS((a, b, c) => a + b + c, 1, 2, 3)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/console1',
        type: 'evaluateJS',
        text: '((a, b, c) => a + b + c).apply(window, [1,2,3])'
    })).toEqual(true)
})

it('rejects if js throws error', async () => {
    client.makeRequest.returns({
        exception: 'foobar',
        exceptionMessage: new Error('foobar')
    })

    let err
    try {
        await consoleActor.evaluateJS(() => {
            throw new Error('foobar')
        })
    } catch (e) {
        err = e
    }

    expect(err).toBeDefined()
    expect(err.message).toEqual('Error: foobar')
})

it('can get preferences', () => {
    const preferences = ['foo', 'bar']
    consoleActor.getPreferences(preferences)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'getPreferences', preferences}
    )).toEqual(true)
})

it('can set preferences', () => {
    const preferences = { foo: 'bar' }
    consoleActor.setPreferences(preferences)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'setPreferences', preferences}
    )).toEqual(true)
})

it('can set autocomplete', () => {
    const text = 'foo'
    const cursor = 123
    consoleActor.autocomplete(text, cursor)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'autocomplete', text, cursor}
    )).toEqual(true)
})

it('can inspect properties', () => {
    consoleActor.inspectObjectProperties()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/console1', type: 'inspectProperties'}
    )).toEqual(true)
})
