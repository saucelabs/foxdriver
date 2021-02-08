import Actor from '../actor'
import Cookies from '../models/cookies'

export default class Storage extends Actor {
    constructor (client, name) {
        super(client, name)
        this.hosts = {}
    }

    /**
     * Get storage list and register each to the client
     *
     * @return {Promise.<Object>} request response
     */
    async listStores () {
        const storages = await this.request('listStores')
        if (storages.cookies) {
            this.hosts.cookies = Object.keys(storages.cookies.hosts)
            this.cookies = new Cookies(this.client, storages.cookies.actor)
        }
        return storages
    }
}
