import Actor from './actor'
import Client from './client'
import Tab from './tab'

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
            return this.log.error(
                'Can\'t close the browser because client was attached to an' +
                'already opened Firefox instance'
            )
        }

        this.firefoxProcess.kill()
    }

    async getTabActors (tabs) {
        const tabActorsRequests = tabs.map(({ actor }) => {
            const tabDescriptor = new Actor(this.client, actor)
            return tabDescriptor.request('getTarget')
        })
        try {
            const tabActors = await Promise.all(tabActorsRequests)
            return tabs.map((tab, index) => ({
                ...tab,
                ...(tabActors[index] ? tabActors[index].frame : null)
            }))
        } catch (error) {
            this.log.error(`Unable to fetch tab actors with error: ${error}`)
            return tabs
        }
    }

    async listTabs () {
        const listTabsResponse = await this.request('listTabs')
        /**
         * For firefox > 75 consoleActor is not available within listTabs request
         */
        if (listTabsResponse.tabs.length && !listTabsResponse.tabs[0].consoleActor) {
            const tabsWithActors = await this.getTabActors([...listTabsResponse.tabs])
            listTabsResponse.tabs = tabsWithActors
        }
        this.setActors(listTabsResponse)
        return listTabsResponse.tabs.map((tab) => new Tab(this.client, tab.actor, tab))
    }
}
