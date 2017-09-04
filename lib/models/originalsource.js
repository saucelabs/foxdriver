import Actor from '../actor'

/**
 * Actor representing an original source of a style sheet that was specified
 * in a source map.
 */
export default class OriginalSource extends Actor {
    /**
     * Protocol method to get the text of this source.
     *
     * @return {Promise}  text of source
     */
    async getText () {
        const { text } = await this.request('getText')
        return text
    }
}
