import Actor from '../actor'

export default class Timeline extends Actor {
    async isRecording () {
        const { value } = await this.request('isRecording')
        return value
    }

    async start (withMarkers, withTicks, withMemory, withFrames, withGCEvents, withDocLoadingEvents) {
        const { value } = await this.request('start', {
            withMarkers, withTicks, withMemory, withFrames, withGCEvents, withDocLoadingEvents
        })
        return value
    }

    async stop () {
        const { value } = await this.request('stop')
        return value
    }
}
