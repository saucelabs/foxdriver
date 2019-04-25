import { stub } from 'sinon'

import Tab from '../../lib/tab'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const tab = new Tab(client, 'server1.conn1.child6/tab1', {
    actor: 'server1.conn1.child6/tab1',
    title: 'Neuer Tab',
    url: 'about:blank',
    outerWindowID: '14748364',
    consoleActor: 'server1.conn1.child6/consoleActor2',
    inspectorActor: 'server1.conn1.child6/inspectorActor3',
    callWatcherActor: 'server1.conn1.child6/callWatcherActor4',
    canvasActor: 'server1.conn1.child6/canvasActor5',
    webglActor: 'server1.conn1.child6/webglActor6',
    webaudioActor: 'server1.conn1.child6/webaudioActor7',
    styleSheetsActor: 'server1.conn1.child6/styleSheetsActor8',
    styleEditorActor: 'server1.conn1.child6/styleEditorActor9',
    storageActor: 'server1.conn1.child6/storageActor10',
    gcliActor: 'server1.conn1.child6/gcliActor11',
    memoryActor: 'server1.conn1.child6/memoryActor12',
    framerateActor: 'server1.conn1.child6/framerateActor13',
    eventLoopLagActor: 'server1.conn1.child6/eventLoopLagActor14',
    reflowActor: 'server1.conn1.child6/reflowActor15',
    cssPropertiesActor: 'server1.conn1.child6/cssPropertiesActor16',
    cssUsageActor: 'server1.conn1.child6/cssUsageActor17',
    monitorActor: 'server1.conn1.child6/monitorActor18',
    timelineActor: 'server1.conn1.child6/timelineActor19',
    profilerActor: 'server1.conn1.child6/profilerActor20',
    performanceActor: 'server1.conn1.child6/performanceActor21',
    animationsActor: 'server1.conn1.child6/animationsActor22',
    promisesActor: 'server1.conn1.child6/promisesActor23',
    performanceEntriesActor: 'server1.conn1.child6/performanceEntriesActor24',
    emulationActor: 'server1.conn1.child6/emulationActor25',
    webExtensionInspectedWindowActor: 'server1.conn1.child6/webExtensionInspectedWindowActor26'
})

test('can navigate to different url', () => {
    tab.navigateTo('foobar.com')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/tab1', type: 'navigateTo', url: 'foobar.com'}
    )).toEqual(true)
})

test('can attach to a tab', () => {
    tab.attach()
    expect(client.makeRequest.calledWith({to: 'server1.conn1.child6/tab1', type: 'attach'})).toEqual(true)
})

test('can detach to a tab', () => {
    tab.detach()
    expect(client.makeRequest.calledWith({to: 'server1.conn1.child6/tab1', type: 'detach'})).toEqual(true)
})

test('can reload', () => {
    tab.reload()
    expect(client.makeRequest.calledWith({to: 'server1.conn1.child6/tab1', type: 'reload'})).toEqual(true)
})

test('can disable cache', () => {
    tab.cacheDisabled(false)
    expect(client.makeRequest.calledWith({to: 'server1.conn1.child6/tab1', type: 'reconfigure', options: {cacheDisabled: false}})).toEqual(true)
})

test('can enable cache', () => {
    tab.cacheDisabled(true)
    expect(client.makeRequest.calledWith({to: 'server1.conn1.child6/tab1', type: 'reconfigure', options: {cacheDisabled: true}})).toEqual(true)
})

test('has available domains registerd', () => {
    jest.mock('../../lib/domains/console', () => jest.fn(() => ({})))
    expect(tab.console).toBeDefined()

    jest.mock('../../lib/domains/network', () => jest.fn(() => ({})))
    expect(tab.network).toBeDefined()

    jest.mock('../../lib/domains/memory', () => jest.fn(() => ({})))
    expect(tab.memory).toBeDefined()

    jest.mock('../../lib/domains/performance', () => jest.fn(() => ({})))
    expect(tab.performance).toBeDefined()

    jest.mock('../../lib/domains/profiler', () => jest.fn(() => ({})))
    expect(tab.profiler).toBeDefined()

    jest.mock('../../lib/domains/timeline', () => jest.fn(() => ({})))
    expect(tab.timeline).toBeDefined()

    jest.mock('../../lib/domains/styleSheets', () => jest.fn(() => ({})))
    expect(tab.styleSheets).toBeDefined()

    jest.mock('../../lib/domains/cssUsage', () => jest.fn(() => ({})))
    expect(tab.cssUsage).toBeDefined()

    jest.mock('../../lib/domains/cssProperties', () => jest.fn(() => ({})))
    expect(tab.cssProperties).toBeDefined()

    jest.mock('../../lib/domains/emulation', () => jest.fn(() => ({})))
    expect(tab.emulation).toBeDefined()

    jest.mock('../../lib/domains/inspector', () => jest.fn(() => ({})))
    expect(tab.inspector).toBeDefined()
})
