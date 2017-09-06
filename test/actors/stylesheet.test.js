import { stub } from 'sinon'

import StyleSheet from '../../lib/models/stylesheet'
import OriginalSource from '../../lib/models/originalsource'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const stylesheet = new StyleSheet(client, 'server1.conn1.child6/stylesheet1', {
    actor: 'server1.conn1.child6/stylesheet1'
})

test('can toggle disabled', async () => {
    client.makeRequest.returns({ disabled: false })

    expect(await stylesheet.toggleDisabled()).toEqual(false)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'toggleDisabled'}
    )).toEqual(true)
})

test('can get text', async () => {
    client.makeRequest.returns({ text: 'foobar' })

    expect(await stylesheet.getText()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'getText'}
    )).toEqual(true)
})

test('can get original source', async () => {
    client.makeRequest.returns({ originalSources: ['foobar', 'test123'] })

    const result = await stylesheet.getOriginalSources()
    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(OriginalSource)
    expect(result[1]).toBeInstanceOf(OriginalSource)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'getOriginalSources'}
    )).toEqual(true)
})

test('can get original location', async () => {
    const line = 12
    const column = 5
    const source = 'foobar.js'
    client.makeRequest.returns({ line, column, source })

    expect(await stylesheet.getOriginalLocation(line, column)).toEqual({ line, column, source })
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'getOriginalLocation', line, column}
    )).toEqual(true)
})

test('can get media rules', async () => {
    client.makeRequest.returns({ mediaRules: 'foobar' })

    expect(await stylesheet.getMediaRules()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'getMediaRules'}
    )).toEqual(true)
})

test('can update', async () => {
    const text = 'foobar'
    const transition = false

    stylesheet.update(text, transition)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/stylesheet1', type: 'update', text, transition}
    )).toEqual(true)
})
