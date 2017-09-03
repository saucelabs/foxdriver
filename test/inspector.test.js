import { stub } from 'sinon'

import Inspector from '../lib/domains/inspector'
import Pagestyle from '../lib/models/pagestyle'
import Highlighter from '../lib/models/highlighter'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const inspector = new Inspector(client, 'server1.conn1.child6/inspector1', {
    actor: 'server1.conn1.child6/inspector1'
})

test('can get walker', async () => {
    client.makeRequest.returns({ walker: 'foobar' })
    expect(await inspector.getWalker({
        foo: 'bar'
    })).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'getWalker', options: { foo: 'bar' }}
    )).toEqual(true)
})

test('can get page style', async () => {
    client.makeRequest.returns({ pageStyle: 'foobar' })
    const pagestyle = await inspector.getPageStyle()
    expect(pagestyle).toBeInstanceOf(Pagestyle)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'getPageStyle'}
    )).toEqual(true)
})

test('can get highligter', async () => {
    client.makeRequest.returns({ highligter: 'foobar' })
    const highlighter = await inspector.getHighlighter(false)
    expect(highlighter).toBeInstanceOf(Highlighter)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'getHighlighter', autohide: false}
    )).toEqual(true)
})

test('can get highligter by name', async () => {
    client.makeRequest.returns({ highligter: 'foobar' })
    const highlighter = await inspector.getHighlighterByType('sometype')
    expect(highlighter).toBeInstanceOf(Highlighter)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'getHighlighterByType', typeName: 'sometype'}
    )).toEqual(true)
})

test('can get image data from url', () => {
    inspector.getImageDataFromURL('someurl', 123)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'getImageDataFromURL', url: 'someurl', maxDim: 123}
    )).toEqual(true)
})

test('can resolve relative url', async () => {
    client.makeRequest.returns({ value: 'foobar' })
    expect(await inspector.resolveRelativeURL('someurl', 123)).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'resolveRelativeURL', url: 'someurl', node: 123}
    )).toEqual(true)
})

test('can pick color from page', () => {
    inspector.pickColorFromPage({ x: 1, y: 2 })
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'pickColorFromPage', options: { x: 1, y: 2 }}
    )).toEqual(true)
})

test('can cancel color pick from page', () => {
    inspector.cancelPickColorFromPage()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'cancelPickColorFromPage'}
    )).toEqual(true)
})

test('can check highlighter support', async () => {
    client.makeRequest.returns({ value: 'foobar' })
    expect(await inspector.supportsHighlighters()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/inspector1', type: 'supportsHighlighters'}
    )).toEqual(true)
})
