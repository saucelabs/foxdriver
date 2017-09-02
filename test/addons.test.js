import { stub } from 'sinon'

import AddonsActor from '../lib/domains/addons'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const addons = new AddonsActor(client, 'server1.conn1.child6/addons1', {
    actor: 'server1.conn1.child6/addons1'
})

test('can navigate to different url', () => {
    const addonPath = '/path/addon'
    addons.installTemporaryAddon(addonPath)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/addons1', type: 'installTemporaryAddon', addonPath}
    )).toEqual(true)
})
