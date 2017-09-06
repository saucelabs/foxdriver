import { stub } from 'sinon'

import StyleSheets from '../../lib/domains/styleSheets'
import StyleSheet from '../../lib/models/stylesheet'

jest.mock('../../lib/logger', () => jest.fn(() => ({ info: () => {} })))

const client = { makeRequest: stub(), on: () => {} }
client.makeRequest.returns({})
const styleSheets = new StyleSheets(client, 'server1.conn1.child6/styleSheets1', {
    actor: 'server1.conn1.child6/styleSheets1'
})

test('can get stylesheets', async () => {
    client.makeRequest.returns({ styleSheets: ['foobar', 'test123'] })

    const result = await styleSheets.getStyleSheets()
    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(StyleSheet)
    expect(result[1]).toBeInstanceOf(StyleSheet)
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/styleSheets1', type: 'getStyleSheets'}
    )).toEqual(true)
})

test('can add stylesheets', async () => {
    client.makeRequest.returns({ styleSheet: 'foobar' })

    expect(await styleSheets.addStyleSheet('foobar')).toEqual('foobar')
    expect(client.makeRequest.calledWith(
        {to: 'server1.conn1.child6/styleSheets1', type: 'addStyleSheet', text: 'foobar'}
    )).toEqual(true)
})
