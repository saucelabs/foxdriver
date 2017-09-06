import { stub } from 'sinon'

import Timeline from '../../lib/domains/timeline'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const timeline = new Timeline(client, 'server1.conn1.child6/timeline1', {
    actor: 'server1.conn1.child6/timeline1'
})

test('can check if recording', async () => {
    client.makeRequest.returns({ value: true })

    expect(await timeline.isRecording()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/timeline1', type: 'isRecording'}
    )).toEqual(true)
})

test('can start', async () => {
    const withMarkers = false
    const withTicks = true
    const withMemory = false
    const withFrames = true
    const withGCEvents = false
    const withDocLoadingEvents = true
    client.makeRequest.returns({ value: true })

    expect(
        await timeline.start(withMarkers, withTicks, withMemory, withFrames, withGCEvents, withDocLoadingEvents)
    ).toEqual(true)
    expect(client.makeRequest.calledWith({
        to: 'server1.conn1.child6/timeline1',
        type: 'start',
        withMarkers,
        withTicks,
        withMemory,
        withFrames,
        withGCEvents,
        withDocLoadingEvents
    })).toEqual(true)
})

test('can stop', async () => {
    client.makeRequest.returns({ value: true })

    expect(await timeline.stop()).toEqual(true)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/timeline1', type: 'stop'}
    )).toEqual(true)
})
