import Actor from '../actor'
import Highlighter from '../models/highlighter'
import Pagestyle from '../models/pagestyle'

export default class Addons extends Actor {
    async getWalker (options) {
        const { walker } = await this.request('getWalker', { options })
        return walker
    }

    async getPageStyle () {
        const { pageStyle } = await this.request('getPageStyle')
        return new Pagestyle(this.client, pageStyle)
    }

    async getHighlighter (autohide) {
        const { highligter } = this.request('getHighlighter', { autohide })
        return new Highlighter(this.client, highligter)
    }

    async getHighlighterByType (typeName) {
        const { highligter } = this.request('getHighlighterByType', { typeName })
        return new Highlighter(this.client, highligter)
    }

    getImageDataFromURL (url, maxDim) {
        return this.request('getImageDataFromURL', { url, maxDim })
    }

    async resolveRelativeURL (url, node) {
        const { value } = await this.request('resolveRelativeURL', { url, node })
        return value
    }

    pickColorFromPage (options) {
        return this.request('pickColorFromPage', { options })
    }

    cancelPickColorFromPage () {
        return this.request('cancelPickColorFromPage')
    }

    async supportsHighlighters () {
        const { value } = await this.request('supportsHighlighters')
        return value
    }
}
