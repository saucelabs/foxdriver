import Launcher from './launcher'
import Browser from './browser'

export default class Foxdriver {
    static async attach (host, port) {
        if (typeof host !== 'string' || typeof port !== 'number') {
            throw new Error('attach() requires host and port parameter')
        }

        const browser = new Browser(host, port)
        const tabs = await browser.connect()
        return { browser, tabs }
    }

    static launch (options) {
        return Launcher.launch(options)
    }
}
