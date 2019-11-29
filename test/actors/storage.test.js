import { stub } from 'sinon'

import Storage from '../../lib/domains/storage'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const storage = new Storage(client, 'server1.conn1.child6/storageActor10', { actor: 'server1.conn1.child6/storageActor10' })

test('can get list of stores', () => {
    client.makeRequest.returns({ value: 'foobar' })

    storage.listStores()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/storageActor10', type: 'listStores'}
    )).toEqual(true)
})
