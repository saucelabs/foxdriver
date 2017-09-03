import { stub } from 'sinon'

import OriginalSource from '../lib/models/originalsource'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const originalSource = new OriginalSource(client, 'server1.conn1.child6/originalSource1', {
    actor: 'server1.conn1.child6/originalSource1'
})

test('can get text', async () => {
    client.makeRequest.returns({ text: 'foobar' })

    expect(await originalSource.getText()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/originalSource1', type: 'getText'}
    )).toEqual(true)
})
