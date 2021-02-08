import { stub } from 'sinon'

import Cookies from '../../lib/models/cookies'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const cookies = new Cookies(client, 'server1.conn1.child6/storageActor10', { actor: 'server1.conn1.child6/storageActor10' })

test('can get list of fields', () => {
    cookies.getFields()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/storageActor10', type: 'getFields'}
    )).toEqual(true)
})

test('can get store objects', () => {
    client.makeRequest.returns({ value: 'foobar' })

    cookies.getStoreObjects('host', 'name', {option1: '1', option2: '2'})
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/storageActor10', type: 'getStoreObjects', options: {option1: '1', option2: '2'}, host: 'host', name: 'name'}
    )).toEqual(true)
})
