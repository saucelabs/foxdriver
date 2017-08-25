import Actor from '../actor'

export default class LongString extends Actor {
    async substring (start, end) {
        const { substring } = await this.request('substring', { start, end })
        return substring
    }

    release () {
        return this.request('release')
    }
}
