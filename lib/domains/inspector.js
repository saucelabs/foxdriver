import Actor from '../actor'
import Highlighter from '../models/highlighter'
import Pagestyle from '../models/pagestyle'

/**
 * Server side of the inspector actor, which is used to create
 * inspector-related actors, including the walker.
 */
export default class Inspector extends Actor {
    /**
     * Get walker
     *
     * @param  {Object}  options  Walker options
     * @return {Promise.Object}   Walker
     */
    async getWalker (options) {
        const { walker } = await this.request('getWalker', { options })
        return walker
    }

    /**
     * Get page style actor.
     *
     * @return {Promise.Pagestyle}  Pagestyle actor
     */
    async getPageStyle () {
        const { pageStyle } = await this.request('getPageStyle')
        return new Pagestyle(this.client, pageStyle)
    }

    /**
     * The most used highlighter actor is the HighlighterActor which can be conveniently
     * retrieved by this method. The same instance will always be returned by this method
     * when called several times. The highlighter actor returned here is used to highlighter
     * elements's box-models from the markup-view, box model, console, debugger, ... as well
     * as select elements with the pointer (pick).
     *
     * @param  {Boolean}  autohide    Optionally autohide the highlighter after an element has been picked
     * @return {Promise.Highlighter}  instance of highlighter
     */
    async getHighlighter (autohide) {
        const { highligter } = this.request('getHighlighter', { autohide })
        return new Highlighter(this.client, highligter)
    }

    /**
     * If consumers need to display several highlighters at the same time or different types of
     * highlighters, then this method should be used, passing the type name of the highlighter
     * needed as argument. A new instance will be created everytime the method is called, so it's
     * up to the consumer to release it when it is not needed anymore
     *
     * @param  {String}  typeName     The type of highlighter to create
     * @return {Promise.Highlighter}  The highlighter actor instance or null if the typeName passed
     *                                doesn't match any available highlighter
     */
    async getHighlighterByType (typeName) {
        const { highligter } = this.request('getHighlighterByType', { typeName })
        return new Highlighter(this.client, highligter)
    }

    /**
     * Get the node's image data if any (for canvas and img nodes). Returns an imageData object with
     * the actual data being a LongStringActor and a size json object. The image data is transmitted
     * as a base64 encoded png data-uri. The method rejects if the node isn't an image or if the
     * image is missing.
     *
     * Accepts a maxDim request parameter to resize images that are larger. This is important as the
     * resizing occurs server-side so that image-data being transfered in the longstring back to the
     * client will be that much smaller.
     *
     * @param  {String} url        image url
     * @param  {Number} maxDim     resizing parameter
     * @return {Promise.<Object>}  image data
     */
    getImageDataFromURL (url, maxDim) {
        return this.request('getImageDataFromURL', { url, maxDim })
    }

    /**
     * Resolve a URL to its absolute form, in the scope of a given content window.
     *
     * @param  {String}    url   url to be resolved
     * @param  {NodeActor} node  If provided, the owner window of this node will be used to resolve
     *                           the URL. Otherwise, the top-level content window will be used instead.
     * @return {Promise.String}  resolved url
     */
    async resolveRelativeURL (url, node) {
        const { value } = await this.request('resolveRelativeURL', { url, node })
        return value
    }

    /**
     * Pick a color from the page using the eye-dropper. This method doesn't return anything
     * but will cause events to be sent to the front when a color is picked or when the user
     * cancels the picker.
     *
     * @param  {Object} options  color picker options
     * @return {Promise}         request response
     */
    pickColorFromPage (options) {
        return this.request('pickColorFromPage', { options })
    }

    /**
     * After the pickColorFromPage method is called, the only way to dismiss the eye-dropper
     * highlighter is for the user to click in the page and select a color. If you need to
     * dismiss the eye-dropper programatically instead, use this method.
     *
     * @return {Promise}  request response
     */
    cancelPickColorFromPage () {
        return this.request('cancelPickColorFromPage')
    }

    /**
     * Check if the current document supports highlighters using a canvasFrame anonymous
     * content container (ie all highlighters except the SimpleOutlineHighlighter).
     * It is impossible to detect the feature programmatically as some document types simply
     * don't render the canvasFrame without throwing any error.
     *
     * @return {Promise}  request response
     */
    async supportsHighlighters () {
        const { value } = await this.request('supportsHighlighters')
        return value
    }
}
