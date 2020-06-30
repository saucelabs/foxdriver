import Actor from './actor'
import Client from './client'
import Tab from './tab'
import os from 'os'
import { spawn } from 'child_process'

export default class Browser extends Actor {
    constructor (host, port) {
        const client = new Client(host, port)

        client.on('error', (error) => this.emit('error', error))
        client.on('end', () => this.emit('end'))
        client.on('timeout', () => this.emit('timeout'))

        super(client, 'root')
        this.cachedTabs = new Map()
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
            if (os.platform() === 'win32') {
                spawn('taskkill', ['/f', '/IM', 'firefox.exe', '/t'])
            } else if (os.platform() === 'darwin' || os.platform() === 'linux') {
                spawn('killall', ['-q', '-I', 'firefox'])
            }
        }
    }

    async listTabs () {
        let listTabsResponse = await this.request('listTabs')
        if (!listTabsResponse.tabs) {
            listTabsResponse = await this.request('listTabs')
        }
        this.setActors(listTabsResponse)
        const tabList = await Promise.all(listTabsResponse.tabs.map(async (tab) => {
            if (this.cachedTabs.has(tab.actor)) {
                return this.cachedTabs.get(tab.actor)
            }
            let newTab = new Tab(this.client, tab.actor, tab)
            // Firefox 75: getTarget
            if (!tab.consoleActor) {
                await newTab.getTarget()
            }
            this.cachedTabs.set(tab.actor, newTab)
            return newTab
        }))
        this._cleanCache(listTabsResponse.tabs.map(tab => tab.actor))
        return tabList
    }

    _cleanCache (activeTabs) {
        Array.from(this.cachedTabs.keys()).forEach((tabName) => {
            if (!activeTabs.includes(tabName)) {
                this.cachedTabs.delete(tabName)
            }
        })
    }
}
