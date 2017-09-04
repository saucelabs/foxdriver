import Actor from '../actor'

/**
 * A LongString actor provides a way to access "very long" strings from the
 * debugger server.
 */
export default class LongString extends Actor {
    /**
     * Get the substring of this LongString from start to end.
     *
     * @param {Number} start
     *        The starting index.
     * @param {Number} end
     *        The ending index.
     * @return {String}  long string text
     */
    async substring (start, end) {
        const { substring } = await this.request('substring', { start, end })
        return substring
    }
}
