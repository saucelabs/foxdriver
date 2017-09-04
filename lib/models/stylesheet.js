import Actor from '../actor'
import OriginalSource from './originalsource'

/**
 * A StyleSheetActor represents a stylesheet on the server.
 */
export default class StyleSheet extends Actor {
    /**
     * Toggle the disabled property of the style sheet
     *
     * @return {Promise.Object}  'disabled' - the disabled state after toggling.
     */
    async toggleDisabled () {
        const { disabled } = await this.request('toggleDisabled')
        return disabled
    }

    /**
     * Protocol method to get the text of this stylesheet.
     *
     * @return {Promise.String}  text of stylesheet
     */
    async getText () {
        const { text } = await this.request('getText')
        return text
    }

    /**
     * Protocol method to get the original source (actors) for this
     * stylesheet if it has uses source maps.
     *
     * @return {Promise.OriginalSource[]}  list of original sources of this stylesheet
     */
    async getOriginalSources () {
        const { originalSources } = await this.request('getOriginalSources')
        return originalSources.map((originalsource) => new OriginalSource(this.client, originalsource))
    }

    /**
     * Protocol method that gets the location in the original source of a
     * line, column pair in this stylesheet, if its source mapped, otherwise
     * a promise of the same location.
     *
     * @return {Promise.Object} object with "source", "line" and "column" property
     */
    async getOriginalLocation (_line, _column) {
        const { source, line, column } = await this.request('getOriginalLocation', {
            line: _line,
            column: _column
        })
        return { source, line, column }
    }

    /**
     * Protocol method to get the media rules for the stylesheet.
     *
     * @return {Promise.MediaRuleActors[]}  list of media rules actors
     */
    async getMediaRules () {
        const { mediaRules } = await this.request('getMediaRules')
        return mediaRules
    }

    /**
     * Update the style sheet in place with new text.
     *
     * @param  {object} request
     *         'text' - new text
     *         'transition' - whether to do CSS transition for change.
     * @return {Promise.Object}  request response
     */
    update (text, transition) {
        return this.request('update', { text, transition })
    }
}
