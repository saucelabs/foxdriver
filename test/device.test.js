import tmp from 'tmp'
import { stub } from 'sinon'

import Device from '../lib/domains/device'

jest.mock('../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const deviceActor = new Device(client, 'server1.conn1.child6/deviceActor1', {
    actor: 'server1.conn1.child6/deviceActor1'
})

test('can get device description', async () => {
    client.makeRequest.returns({ value: 'foobar' })

    expect(await deviceActor.getDescription()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/deviceActor1', type: 'getDescription'}
    )).toEqual(true)
})

test('can get wallpaper', async () => {
    client.makeRequest.returns({ value: 'foobar' })

    expect(await deviceActor.getWallpaper()).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/deviceActor1', type: 'getWallpaper'}
    )).toEqual(true)
})

test('can generate screenshot to data url', () => {
    client.makeRequest.returns({ value: 'foobar' })

    deviceActor.screenshotToDataURL()
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/deviceActor1', type: 'getWallpaper'}
    )).toEqual(true)
})

test('jojo can make screenshots', async () => {
    client.makeRequest.returns({
        value: {
            actor: 'server1.conn1.child6/longstring1',
            length: 3
        },
        substring: 'foobar'
    })
    const tmpobj = tmp.fileSync()

    await deviceActor.screenshotToFile(tmpobj.name)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/deviceActor1', type: 'screenshotToDataURL'}
    )).toEqual(true)

    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/longstring1', type: 'substring', start: 0, end: 3}
    )).toEqual(true)
})
