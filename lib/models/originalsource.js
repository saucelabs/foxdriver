import Actor from '../actor'

export default class OriginalSource extends Actor {
    async getText () {
        const { text } = await this.request('getText')
        return text
    }
}
