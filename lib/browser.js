import Actor from './actor'
import Client from './client'
import Tab from './tab'
import { spawn } from 'child_process'

export default class Browser extends Actor {
    constructor (host, port) {
        const client = new Client(host, port)

        client.on('error', (error) => this.emit('error', error))
        client.on('end', () => this.emit('end'))
        client.on('timeout', () => this.emit('timeout'))

        super(client, 'root')
    }

    get preference () { return this._get('preference') }
    get actorRegistry () { return this._get('actorRegistry') }
    get addons () { return this._get('addons') }
    get device () { return this._get('device') }
    get heapSnapshotFile () { return this._get('heapSnapshotFile') }

    async connect () {
        await this.client.connect()
        this.client.expectReply(this.name, ({ traits }) => { this.traits = traits })
        this.tabs = await this.listTabs()
        return this.tabs
    }

    disconnect () {
        this.client.disconnect()
    }

    close () {
        this.disconnect()

        /**
         * only shut down browser if started via launcher
         */
        if (!this.firefoxProcess) {
            return console.error(
                'Can\'t close the browser because client was attached to an' +
                'already opened Firefox instance'
            )
        }

        this.firefoxProcess.kill()
        if (!this.firefoxProcess.killed) {
            spawn('taskkill', ['/f', '/IM', 'firefox.exe', '/t'])
        }
    }

    async listTabs () {
        let listTabsResponse = await this.request('listTabs')
        if (!listTabsResponse.tabs) {
            listTabsResponse = await this.request('listTabs')
        }
        this.setActors(listTabsResponse)
        return listTabsResponse.tabs.map((tab) => new Tab(this.client, tab.actor, tab))
    }
}
