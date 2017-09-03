import { stub } from 'sinon'

import Preference from '../lib/domains/preference'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const preference = new Preference(client, 'server1.conn1.child6/preference1', {
    actor: 'server1.conn1.child6/preference1'
})

test('can get boolean preference', async () => {
    client.makeRequest.returns({ value: true })

    expect(await preference.getBoolPref('foobar')).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'getBoolPref', value: 'foobar'}
    )).toEqual(true)
})

test('can get character preference', async () => {
    client.makeRequest.returns({ value: true })

    expect(await preference.getCharPref('foobar')).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'getCharPref', value: 'foobar'}
    )).toEqual(true)
})

test('can get integer preference', async () => {
    client.makeRequest.returns({ value: true })

    expect(await preference.getIntPref('foobar')).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'getIntPref', value: 'foobar'}
    )).toEqual(true)
})

test('can get all preferences', async () => {
    client.makeRequest.returns({ value: true })

    expect(await preference.getAllPrefs()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'getAllPrefs'}
    )).toEqual(true)
})

test('can set boolean preference', async () => {
    const name = 'some name'
    const value = false

    preference.setBoolPref(name, value)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'setBoolPref', name, value}
    )).toEqual(true)
})

test('can set char preference', async () => {
    const name = 'some name'
    const value = 'c'

    preference.setCharPref(name, value)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'setCharPref', name, value}
    )).toEqual(true)
})

test('can set integer preference', async () => {
    const name = 'some name'
    const value = 42

    preference.setIntPref(name, value)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'setIntPref', name, value}
    )).toEqual(true)
})

test('can clear user preference', async () => {
    const name = 'myPref'

    preference.clearUserPref(name)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/preference1', type: 'clearUserPref', name}
    )).toEqual(true)
})
