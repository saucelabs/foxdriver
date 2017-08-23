import Tab from './tab'
import Client from './client'
import Actor from './actor'
import Launcher from './launcher'

export default class FirefoxClient extends Actor {
    constructor (host, port) {
        const client = new Client(host, port)

        client.on('error', (error) => this.emit('error', error))
        client.on('end', () => this.emit('end'))
        client.on('timeout', () => this.emit('timeout'))

        super(client, 'root')
    }

    disconnect () {
        this.client.disconnect()
    }

    async connect () {
        await this.client.connect()
        this.client.expectReply(this.name, ({ traits }) => { this.traits = traits })
        this.tabs = await this.listTabs()
        return this.tabs
    }

    async listTabs () {
        const { tabs } = await this.request('listTabs')
        return tabs.map((tab) => new Tab(this.client, tab))
    }

    static launch (options) {
        return Launcher.launch(options)
    }
}
