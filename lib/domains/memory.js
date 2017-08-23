import Actor from '../actor'

export default class Memory extends Actor {
    constructor (client, name) {
        super(client, name)
        this.isAttached = false
    }

    attach () {
        this.isAttached = true
        return this.request('attach')
    }

    detach () {
        this.isAttached = false
        return this.request('detach')
    }

    async getState () {
        const { state } = await this.request('getState')
        this.isAttached = state === 'attached'
        return state
    }

    takeCensus () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('takeCensus')
    }

    async startRecordingAllocations (options) {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { value } = await this.request('startRecordingAllocations', { options })
        return value
    }

    async stopRecordingAllocations () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { value } = await this.request('stopRecordingAllocations')
        return value
    }

    async getAllocationsSettings () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { options } = await this.request('getAllocationsSettings')
        return options
    }

    getAllocations () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('getAllocations')
    }

    forceGarbageCollection () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('forceGarbageCollection')
    }

    forceCycleCollection () {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        return this.request('forceCycleCollection')
    }

    measure () {
        return this.request('measure')
    }

    async residentUnique () {
        const { residentUnique } = await this.request('residentUnique')
        return residentUnique
    }

    async saveHeapSnapshot (boundaries) {
        if (!this.isAttached) {
            throw new Error('You need to be attached to the tab')
        }

        const { snapshotId } = await this.request('saveHeapSnapshot', { boundaries })
        return snapshotId
    }
}
