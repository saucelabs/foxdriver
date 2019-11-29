import Actor from '../actor'

export default class Cookies extends Actor {
    /**
     * Function gets all storage fields from the browser
     */
    getFields () {
        return this.request('getFields')
    }

    /**
     * Function gets a specific cookie under a specific host
     *
     * @param {String} host
     * @param {String} name
     * @param {Object} options
     * @returns {Promise.<object>} //data
     */
    async getStoreObjects (host, name, options = {}) {
        const { data } = await this.request('getStoreObjects', {host: host, name: name, options: options})
        return data
    }
}
