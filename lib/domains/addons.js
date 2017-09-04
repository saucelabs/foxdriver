import Actor from '../actor'

/**
 * Addons actor allows to handle addons in Firefox
 */
export default class Addons extends Actor {
    /**
     * install temporary addon
     * @param  {String}  addonPath  path to the add on
     * @return {Promise.<Object>}   addon data
     */
    async installTemporaryAddon (addonPath) {
        const { addon } = this.request('installTemporaryAddon', { addonPath })
        return addon
    }
}
