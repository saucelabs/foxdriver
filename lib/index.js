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

    close () {
        this.disconnect()

        if (!this.firefoxProcess) {
            return console.error(
                'Can\'t close the browser because client was attached to an' +
                'already opened Firefox instance'
            );
        }

        this.firefoxProcess.kill()
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
