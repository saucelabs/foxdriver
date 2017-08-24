import Tab from './tab'
import Client from './client'
import Actor from './actor'
import Launcher from './launcher'
import domains from './domains'

export default class Foxdriver extends Actor {
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
        const listTabsResponse = await this.request('listTabs')

        if (!this.hasRegisteredActors) {
            this.hasRegisteredActors = true

            /**
             * register actors on browser
             */
            for (const [key, actor] of Object.entries(listTabsResponse)) {
                const actorName = key.slice(0, -5)
                if (!key.endsWith('Actor') || !domains[actorName]) {
                    continue
                }
                this[actorName] = new domains[actorName](this.client, actor)
            }
        }

        return listTabsResponse.tabs.map((tab) => new Tab(this.client, tab))
    }

    static launch (options) {
        return Launcher.launch(options)
    }
}
