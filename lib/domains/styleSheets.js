import Actor from '../actor'
import StyleSheet from '../models/stylesheet'

export default class StyleSheets extends Actor {
    async getStyleSheets () {
        const { styleSheets } = await this.request('getStyleSheets')
        return styleSheets.map((payload) => new StyleSheet(this.client, payload))
    }

    async addStyleSheet (text) {
        const { styleSheet } = await this.request('addStyleSheet', { text })
        return styleSheet
    }
}
