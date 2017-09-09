import Foxdriver from '../lib'

jest.setTimeout(30000)

test('should be able to launch and attach to Firefox', async () => {
    const { browser, tab } = await Foxdriver.launch({
        url: 'https://www.mozilla.org/en-US'
    })

    expect(browser).toBeDefined()
    expect(tab).toBeDefined()
    expect(tab.data.url).toEqual('about:blank')

    await browser.close()
})
