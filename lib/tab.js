import Actor from './actor'

export default class Tab extends Actor {
    constructor (client, name, data) {
        super(client, name, data)
        this._onTabNavigated = null
        this.on('tabNavigated', event => {
            if (event.state === 'stop') {
                this._onTabNavigated && this._onTabNavigated(event)
            }
        })
    }

    get console () { return this._get('console') }
    get network () { return this._get('console', 'network') }
    get storage () { return this._get('storage') }
    get memory () { return this._get('memory') }
    get performance () { return this._get('performance') }
    get profiler () { return this._get('profiler') }
    get timeline () { return this._get('timeline') }
    get styleSheets () { return this._get('styleSheets') }
    get cssUsage () { return this._get('cssUsage') }
    get cssProperties () { return this._get('cssProperties') }
    get emulation () { return this._get('emulation') }
    get inspector () { return this._get('inspector') }

    /**
     * Firefox 75: Gets Tab's actors
     * @returns {Promise} request promise
     */
    async getTarget () {
        let targets = await this.request('getTarget')
        this.name = targets.frame.actor
        this.data = targets.frame
        this.setActors(this.data)
    }

    /**
     * Disable/Enables cache
     * @param {Boolean} disable
     * @returns {Promise} request promise
     */
    cacheDisabled (disable) {
        return this.request('reconfigure', {'options': {cacheDisabled: disable}})
    }

    /**
     * Calls a callback on tab navigated event
     * @param  {Function} callback  function to be called
     */
    onTabNavigated (callback) {
        this._onTabNavigated = callback
    }

    /**
     * attach to tab
     * @return {Promise}  request promise
     */
    attach () {
        return this.request('attach')
    }

    /**
     * detach from tab
     * @return {Promise}  request promise
     */
    detach () {
        return this.request('detach')
    }

    /**
     * reloads current page url
     * @return {Promise}  request promise
     */
    reload () {
        return this.request('reload')
    }

    /**
     * navigates to a certain url
     * @param  {string}  url to navigate to
     * @return {Promise}     request promise
     */
    navigateTo (url) {
        return this.request('navigateTo', { url })
    }
}
