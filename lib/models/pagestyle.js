import Actor from '../actor'

export default class Pagestyle extends Actor {
    async getComputed (node, markMatched, onlyMatched, filter) {
        const { computed } = await this.request('getComputed', {
            node, markMatched, onlyMatched, filter
        })
        return computed
    }

    async getAllUsedFontFaces (includePreviews, previewText, previewFontSize, previewFillStyle) {
        const { fontFaces } = await this.request('getAllUsedFontFaces', {
            includePreviews, previewText, previewFontSize, previewFillStyle
        })
        return fontFaces
    }

    async getUsedFontFaces (node, includePreviews, previewText, previewFontSize, previewFillStyle) {
        const { fontFaces } = await this.request('getUsedFontFaces', {
            node, includePreviews, previewText, previewFontSize, previewFillStyle
        })
        return fontFaces
    }

    async getMatchedSelectors (node, property, filter) {
        const { rules, sheets, matched } = await this.request('getMatchedSelectors', {
            node, property, filter
        })
        return { rules, sheets, matched }
    }

    getApplied (node, inherited, matchedSelectors, skipPseudo, filter) {
        return this.request('getApplied', {
            node, inherited, matchedSelectors, skipPseudo, filter
        })
    }

    async isPositionEditable (node) {
        const { value } = await this.request('isPositionEditable', { node })
        return value
    }

    getLayout (node, autoMargins) {
        return this.request('getLayout', { node, autoMargins })
    }

    addNewRule (node, pseudoClasses, editAuthored) {
        return this.request('addNewRule', { node, pseudoClasses, editAuthored })
    }
}
