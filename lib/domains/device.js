import Actor from '../actor'

export default class Device extends Actor {
    async getDescription () {
        const { value } = await this.request('getDescription')
        return value
    }

    async getWallpaper () {
        const { value } = await this.request('getWallpaper')
        return value
    }

    async screenshotToDataURL () {
        const { value } = await this.request('screenshotToDataURL')
        return value
    }
}
