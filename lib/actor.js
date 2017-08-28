import EventEmitter from 'events'

import logger from './logger'

export default class Actor extends EventEmitter {
    constructor (client, name, data) {
        super()
        this.client = client
        this.name = name
        this.isEnabled = false
        this.data = data
        this.log = logger(`Actor:${name}`)

        this.client.on('message', (message) => {
            if (message.from === this.name) {
                this.emit(message.type, message)
            }
        })

        this._registeredDomains = {}
        this.setActors(data)
    }

    setActors (payload = {}) {
        this._actors = Object.keys(payload)
            .filter((key) => key.endsWith('Actor'))
            .reduce((obj, key) => {
                obj[key] = payload[key]
                return obj
            }, {})
    }

    async request (type, message = {}) {
        message.to = this.name
        message.type = type

        const result = await this.client.makeRequest(message)

        if (result.error) {
            throw new Error(`${result.message} (${result.error})`)
        }

        return result
    }

    _get (domain, alias) {
        const apiName = alias || domain
        const actorId = this._actors[`${domain}Actor`]

        if (!this._registeredDomains[apiName] && actorId) {
            /**
             * require domain actor dynamically
             */
            const Domain = require(`./domains/${apiName}`)
            this._registeredDomains[apiName] = new Domain(this.client, actorId)
            this.log.info(`registered ${apiName} with actor id ${actorId}`)
        }

        return this._registeredDomains[apiName]
    }
}
