import { stub } from 'sinon'

import Pagestyle from '../../lib/models/pagestyle'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const pagestyle = new Pagestyle(client, 'server1.conn1.child6/pagestyle1', {
    actor: 'server1.conn1.child6/pagestyle1'
})

test('can get computed css for node', async () => {
    client.makeRequest.returns({ computed: 'foobar' })

    expect(await pagestyle.getComputed(1, 2, 3, 4)).toEqual('foobar')
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getComputed',
        node: 1,
        markMatched: 2,
        onlyMatched: 3,
        filter: 4
    })).toEqual(true)
})

test('can get all used font faces', async () => {
    client.makeRequest.returns({ fontFaces: 'foobar' })

    expect(await pagestyle.getAllUsedFontFaces(1, 2, 3, 4)).toEqual('foobar')
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getAllUsedFontFaces',
        includePreviews: 1,
        previewText: 2,
        previewFontSize: 3,
        previewFillStyle: 4
    })).toEqual(true)
})

test('can get all used font faces for node', async () => {
    client.makeRequest.returns({ fontFaces: 'foobar' })

    expect(await pagestyle.getUsedFontFaces(0, 1, 2, 3, 4)).toEqual('foobar')
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getUsedFontFaces',
        node: 0,
        includePreviews: 1,
        previewText: 2,
        previewFontSize: 3,
        previewFillStyle: 4
    })).toEqual(true)
})

test('can get matched selectors', async () => {
    const response = { rules: 'no rules', sheets: 'test123', matched: 'foobar' }
    client.makeRequest.returns(response)

    expect(await pagestyle.getMatchedSelectors(0, 1, 2)).toEqual(response)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getMatchedSelectors',
        node: 0,
        property: 1,
        filter: 2
    })).toEqual(true)
})

test('can get applied styles', async () => {
    const node = 1
    const inherited = 2
    const matchedSelectors = 3
    const skipPseudo = 4
    const filter = 5
    pagestyle.getApplied(node, inherited, matchedSelectors, skipPseudo, filter)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getApplied',
        node,
        inherited,
        matchedSelectors,
        skipPseudo,
        filter
    })).toEqual(true)
})

test('can check if position is editable', async () => {
    client.makeRequest.returns({ value: 'foobar' })

    expect(await pagestyle.isPositionEditable(123)).toEqual('foobar')
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'isPositionEditable',
        node: 123
    })).toEqual(true)
})

test('can get layout', () => {
    pagestyle.getLayout(123, true)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'getLayout',
        node: 123,
        autoMargins: true
    })).toEqual(true)
})

test('can add new rule', () => {
    pagestyle.addNewRule(123, true, false)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/pagestyle1',
        type: 'addNewRule',
        node: 123,
        pseudoClasses: true,
        editAuthored: false
    })).toEqual(true)
})
