import { stub } from 'sinon'

import Highlighter from '../lib/models/highlighter'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const highligter = new Highlighter(client, 'server1.conn1.child6/highligter1', {
    actor: 'server1.conn1.child6/highligter1'
})

test('can show box model', () => {
    highligter.showBoxModel(1, 2, 3, 4, 5, 6)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/highligter1',
        type: 'showBoxModel',
        node: 1,
        region: 2,
        hideInfoBar: 3,
        hideGuides: 4,
        showOnly: 5,
        onlyRegionArea: 6
    })).toEqual(true)
})

test('can hide box model', () => {
    highligter.hideBoxModel()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/highligter1', type: 'hideBoxModel'}
    )).toEqual(true)
})

test('can pick', () => {
    highligter.pick()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/highligter1', type: 'pick'}
    )).toEqual(true)
})

test('can pick and focus', () => {
    highligter.pickAndFocus()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/highligter1', type: 'pickAndFocus'}
    )).toEqual(true)
})

test('can cancel pick', () => {
    highligter.cancelPick()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/highligter1', type: 'cancelPick'}
    )).toEqual(true)
})
