import Actor from '../actor'
import OriginalSource from './originalsource'

export default class StyleSheet extends Actor {
    async toggleDisabled () {
        const { disabled } = await this.request('toggleDisabled')
        return disabled
    }

    async getText () {
        const { text } = await this.request('getText')
        return text
    }

    async getOriginalSources () {
        const { originalSources } = await this.request('getOriginalSources')
        return originalSources.map((originalsource) => new OriginalSource(this.client, originalsource))
    }

    async getOriginalLocation (_line, _column) {
        const { source, line, column } = await this.request('getOriginalLocation', {
            line: _line,
            column: _column
        })
        return { source, line, column }
    }

    async getMediaRules () {
        const { mediaRules } = await this.request('getMediaRules')
        return mediaRules
    }

    update (text, transition) {
        return this.request('update', { text, transition })
    }
}
