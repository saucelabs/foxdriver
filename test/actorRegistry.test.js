import { stub } from 'sinon'

import ActorRegistry from '../lib/domains/actorRegistry'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const actorRegistry = new ActorRegistry(client, 'server1.conn1.child6/actorRegistry1', {
    actor: 'server1.conn1.child6/actorRegistry1'
})

test('can navigate to different url', () => {
    const sourceText = 'sourceText'
    const filename = 'filename'
    const options = 'options'
    actorRegistry.registerActor(sourceText, filename, options)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/actorRegistry1', type: 'registerActor', sourceText, filename, options}
    )).toEqual(true)
})
