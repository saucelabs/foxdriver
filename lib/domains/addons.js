import Actor from '../actor'

export default class Addons extends Actor {
    async installTemporaryAddon (addonPath) {
        const { addon } = this.request('installTemporaryAddon', { addonPath })
        return addon
    }
}
