import Actor from '../actor'

/**
 * The Highlighter is the server-side entry points for any tool that wishes to
 * highlight elements in some way in the content document.
 *
 * A little bit of vocabulary:
 * - <something>HighlighterActor classes are the actors that can be used from
 *   the client. They do very little else than instantiate a given
 *   <something>Highlighter and use it to highlight elements.
 * - <something>Highlighter classes aren't actors, they're just JS classes that
 *   know how to create and attach the actual highlighter elements on top of the
 *   content
 *
 * The most used highlighter actor is the HighlighterActor which can be
 * conveniently retrieved via the InspectorActor's 'getHighlighter' method.
 * The InspectorActor will always return the same instance of
 * HighlighterActor if asked several times and this instance is used in the
 * toolbox to highlighter elements's box-model from the markup-view,
 * box model view, console, debugger, ... as well as select elements with the
 * pointer (pick).
 *
 * Other types of highlighter actors exist and can be accessed via the
 * InspectorActor's 'getHighlighterByType' method.
 */
export default class Highlighter extends Actor {
    /**
     * Display the box model highlighting on a given NodeActor.
     * There is only one instance of the box model highlighter, so calling this
     * method several times won't display several highlighters, it will just move
     * the highlighter instance to these nodes.
     *
     * @param {NodeActor} node
     *        The node to be highlighted
     * @param {Object}    region
     *        region of box model
     * @param {Boolean}   hideInfoBar
     *        true if to hide info bar
     * @param {Boolean}   hideGuides
     *        true if to hide guides
     * @param {Boolean}   showOnly
     *        true if show only
     * @param {Boolean}   onlyRegionArea
     *        true if only region area
     * @return {Promise}  request response
     */
    showBoxModel (node, region, hideInfoBar, hideGuides, showOnly, onlyRegionArea) {
        return this.request('showBoxModel', {
            node, region, hideInfoBar, hideGuides, showOnly, onlyRegionArea
        })
    }

    /**
     * Hide the box model highlighting if it was shown before
     *
     * @return {Promise}  request response
     */
    hideBoxModel () {
        return this.request('hideBoxModel')
    }

    /**
     * Pick a node on click, and highlight hovered nodes in the process.
     *
     * This method doesn't respond anything interesting, however, it starts
     * mousemove, and click listeners on the content document to fire
     * events and let connected clients know when nodes are hovered over or
     * clicked.
     *
     * Once a node is picked, events will cease, and listeners will be removed.
     *
     * @return {Promise}  request response
     */
    pick () {
        return this.request('pick')
    }

    /**
     * This pick method also focuses the highlighter's target window.
     *
     * @return {Promise}  request response
     */
    pickAndFocus () {
        return this.request('pickAndFocus')
    }

    /**
     * cancel current pick
     *
     * @return {Promise}  request response
     */
    cancelPick () {
        return this.request('cancelPick')
    }
}
