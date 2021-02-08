import FirefoxProfile from 'firefox-profile'
import Geckodriver from 'geckodriver'
import { remote } from 'webdriverio'

import Foxdriver from '../lib'

let browser

jest.setTimeout(30000)

beforeAll(async () => {
    Geckodriver.start()
    const fp = new FirefoxProfile()
    fp.setPreference('devtools.debugger.remote-enabled', true)
    fp.setPreference('devtools.chrome.enabled', true)
    fp.setPreference('devtools.debugger.prompt-connection', false)

    const zippedProfile = await new Promise((resolve, reject) => {
        fp.encoded((err, zippedProfile) => {
            if (err) return reject(err)
            return resolve(zippedProfile)
        })
    })

    browser = await remote({
        logLevel: 'trace',
        capabilities: {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: [
                    '-start-debugger-server', '9222'
                ],
                profile: zippedProfile
            }
        }
    })
})

test('should be able to attach on a running firefox instance', async () => {
    // start browser
    await browser.url('https://json.org')

    // attach to browser
    const { tabs } = await Foxdriver.attach('localhost', 9222)

    expect(tabs).toHaveLength(1)
    expect(tabs[0].data.url).toContain('json.org')
    expect(tabs[0].data.title).toEqual('JSON')
})

afterAll(async () => {
    // close session
    await browser.deleteSession()
    // shut down driver
    await Geckodriver.stop()
})
