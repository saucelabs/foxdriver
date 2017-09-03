import Actor from '../actor'

export default class Highlighter extends Actor {
    showBoxModel (node, region, hideInfoBar, hideGuides, showOnly, onlyRegionArea) {
        return this.request('showBoxModel', {
            node, region, hideInfoBar, hideGuides, showOnly, onlyRegionArea
        })
    }

    hideBoxModel () {
        return this.request('hideBoxModel')
    }

    pick () {
        return this.request('pick')
    }

    pickAndFocus () {
        return this.request('pickAndFocus')
    }

    cancelPick () {
        return this.request('cancelPick')
    }
}
