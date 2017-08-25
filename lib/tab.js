import domains from './domains'
import logger from './logger'

export default class Tab {
    constructor (client, { actor, title, url, outerWindowID, ...actors }) {
        this.client = client
        this.actor = actor
        this.title = title
        this.url = url
        this.outerWindowID = outerWindowID
        this.log = logger('Tab')

        this._actors = actors
        this._registeredDomains = {}
    }

    get console () { return this._get('console') }
    get network () { return this._get('console', 'network') }
    get memory () { return this._get('memory') }
    get performance () { return this._get('performance') }
    get profiler () { return this._get('profiler') }
    get timeline () { return this._get('timeline') }
    get styleSheets () { return this._get('styleSheets') }
    get cssUsage () { return this._get('cssUsage') }
    get cssProperties () { return this._get('cssProperties') }
    get emulation () { return this._get('emulation') }
    get inspector () { return this._get('inspector') }

    _get (domain, alias) {
        const apiName = alias || domain
        if (!this._registeredDomains[apiName]) {
            const actorId = this._actors[`${domain}Actor`]
            this._registeredDomains[apiName] = new domains[apiName](this.client, actorId)
            this.log.info(`registered ${apiName} with actor id ${actorId}`)
        }
        return this._registeredDomains[apiName]
    }
}
