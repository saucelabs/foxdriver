import { stub } from 'sinon'

import ActorActor from '../../lib/models/actorActor'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const actorActor = new ActorActor(client, 'server1.conn1.child6/actorActor1', {
    actor: 'server1.conn1.child6/actorActor1'
})

test('can unregister actor', () => {
    actorActor.unregister()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/actorActor1', type: 'unregister'}
    )).toEqual(true)
})
