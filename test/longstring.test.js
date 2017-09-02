import { stub } from 'sinon'

import LongString from '../lib/models/longString'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const longstring = new LongString(client, 'server1.conn1.child6/longstring1', {
    actor: 'server1.conn1.child6/longstring1'
})

test('can call substring', async () => {
    client.makeRequest.returns({ substring: 'foobar' })

    expect(await longstring.substring(0, 10)).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/longstring1', type: 'substring', start: 0, end: 10}
    )).toEqual(true)
})

test('can release longstring', () => {
    longstring.release()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/longstring1', type: 'release'}
    )).toEqual(true)
})
