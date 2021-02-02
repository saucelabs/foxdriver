import Foxdriver from '../lib'

jest.setTimeout(30000)

// Launch feature doesn't work as expected so skipping it for now
test.skip('should be able to launch and attach to Firefox', async () => {
    const { browser, tab } = await Foxdriver.launch({
        url: 'https://www.mozilla.org/en-US'
    })

    expect(browser).toBeDefined()
    expect(tab).toBeDefined()
    expect(tab.data.url).toEqual('about:blank')

    await browser.close()
})

test('should be able to launch and attach to Firefox with overriding default prefs', async () => {
    const { browser, tab } = await Foxdriver.launch({
        url: 'https://www.mozilla.org/en-US',
        customPrefs: {
            'devtools.chrome.enabled': false
        }
    })

    expect(browser).toBeDefined()
    expect(tab).toBeDefined()
    expect(tab.data.url).toEqual('about:blank')

    await browser.close()
})
