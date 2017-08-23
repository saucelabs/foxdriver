import Actor from '../actor'

export default class Performance extends Actor {
    connect (options) {
        return this.request('connect', { options })
    }

    async canCurrentlyRecord (options) {
        const { value } = await this.request('canCurrentlyRecord')
        return value
    }

    async startRecording (options) {
        const { recording } = await this.request('startRecording', { options })
        return recording
    }

    async stopRecording (options) {
        const { recording } = await this.request('stopRecording', { options })
        return recording
    }

    async isRecording () {
        const { isRecording } = await this.request('isRecording')
        return isRecording
    }

    async getRecordings () {
        const { recordings } = await this.request('getRecordings')
        return recordings
    }

    async getConfiguration () {
        const { config } = await this.request('getConfiguration')
        return config
    }

    setProfilerStatusInterval (interval) {
        return this.request('setProfilerStatusInterval', { interval })
    }
}
