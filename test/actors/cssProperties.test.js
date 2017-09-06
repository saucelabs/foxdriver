import { stub } from 'sinon'

import CSSProperties from '../../lib/domains/cssProperties'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const cssPropertiesActor = new CSSProperties(client, 'server1.conn1.child6/cssPropertiesActor1', {
    actor: 'server1.conn1.child6/cssPropertiesActor1'
})

test('can unregister actor', () => {
    cssPropertiesActor.getCSSDatabase()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/cssPropertiesActor1', type: 'getCSSDatabase'}
    )).toEqual(true)
})
