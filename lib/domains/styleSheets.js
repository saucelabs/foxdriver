import Actor from '../actor'
import StyleSheet from '../models/stylesheet'

/**
 * Creates a StyleSheetsActor. StyleSheetsActor provides remote access to the
 * stylesheets of a document.
 */
export default class StyleSheets extends Actor {
    /**
     * Protocol method for getting a list of StyleSheetActors representing
     * all the style sheets in this document.
     *
     * @return {Promise.StyleSheet[]} list of all stylesheets of this document
     */
    async getStyleSheets () {
        const { styleSheets } = await this.request('getStyleSheets')
        return styleSheets.map((payload) => new StyleSheet(this.client, payload))
    }

    /**
     * Create a new style sheet in the document with the given text.
     * Return an actor for it.
     *
     * @param  {Object} request
     *         Debugging protocol request object, with 'text property'
     * @return {Promise.Object}
     *         Object with 'styelSheet' property for form on new actor.
     */
    async addStyleSheet (text) {
        const { styleSheet } = await this.request('addStyleSheet', { text })
        return styleSheet
    }
}
