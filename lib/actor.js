import EventEmitter from 'events'

export default class Actor extends EventEmitter {
    constructor (client, name) {
        super()
        this.client = client
        this.name = name
        this.isEnabled = false

        this.client.on('message', (message) => {
            if (message.from === this.name) {
                this.emit(message.type, message)
            }
        })
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
}
