import Actor from '../actor'

/**
 * CSSUsage manages the collection of CSS usage data.
 * The core of a CSSUsage is a JSON-able data structure called _knownRules
 * which looks like this:
 * This records the CSSStyleRules and their usage.
 * The format is:
 *     Map({
 *       <CSS-URL>|<START-LINE>|<START-COLUMN>: {
 *         selectorText: <CSSStyleRule.selectorText>,
 *         test: <simplify(CSSStyleRule.selectorText)>,
 *         cssText: <CSSStyleRule.cssText>,
 *         isUsed: <TRUE|FALSE>,
 *         presentOn: Set([ <HTML-URL>, ... ]),
 *         preLoadOn: Set([ <HTML-URL>, ... ]),
 *         isError: <TRUE|FALSE>,
 *       }
 *     })
 *
 * For example:
 *     this._knownRules = Map({
 *       "http://eg.com/styles1.css|15|0": {
 *         selectorText: "p.quote:hover",
 *         test: "p.quote",
 *         cssText: "p.quote { color: red; }",
 *         isUsed: true,
 *         presentOn: Set([ "http://eg.com/page1.html", ... ]),
 *         preLoadOn: Set([ "http://eg.com/page1.html" ]),
 *         isError: false,
 *       }, ...
 *     });
 */
export default class CSSUsage extends Actor {
    /**
     * Begin recording usage data
     *
     * @param  {Boolean} [url=false] It's best if we start by reloading the current page
     *                               because that starts the test at a known point, but there could be reasons
     *                               why we don't want to do that (e.g. the page contains state that will be
     *                               lost across a reload)
     * @return {Promise.<Object>}    request response
     */
    start (url = false) {
        return this.request('start', { url })
    }

    /**
     * Cease recording usage data
     *
     * @return {Promise.<Object>}    request response
     */
    stop () {
        return this.request('stop')
    }

    /**
     * Start/stop recording usage data depending on what we're currently doing.
     *
     * @return {Promise.<Object>}    request response
     */
    toggle () {
        return this.request('toggle')
    }

    /**
     * Running start() quickly followed by stop() does a bunch of unnecessary work, so this cuts all that out
     *
     * @return {Promise.<Object>}    request response
     */
    oneshot () {
        return this.request('oneshot')
    }

    /**
     * Returns a JSONable structure designed to help marking up the style editor,
     * which describes the CSS selector usage.
     * Example:
     * [
     *     {
     *         selectorText: "p#content",
     *         usage: "unused|used",
     *         start: { line: 3, column: 0 },
     *     },
     *     ...
     * ]
     *
     * @param  {String}  url        url of page you want to audit
     * @return {Promise.<Object>}   request response
     */
    async createEditorReport (url) {
        const { reports } = await this.request('createEditorReport', { url })
        return reports
    }

    /**
     * Compute the stylesheet URL and delegate the report creation to createEditorReport.
     * See createEditorReport documentation.
     *
     * @param  {String}  url        url of page you want to audit
     * @return {Promise.<Object>}   request response
     */
    async createEditorReportForSheet (url) {
        const { reports } = await this.request('createEditorReportForSheet', { url })
        return reports
    }

    /**
     * Returns a JSONable structure designed for the page report which shows
     * the recommended changes to a page.
     *
     * "preload" means that a rule is used before the load event happens, which
     * means that the page could by optimized by placing it in a <style> element
     * at the top of the page, moving the <link> elements to the bottom.
     *
     * Example:
     *   {
     *     preload: [
     *       {
     *         url: "http://example.org/page1.html",
     *         shortUrl: "page1.html",
     *         rules: [
     *           {
     *             url: "http://example.org/style1.css",
     *             shortUrl: "style1.css",
     *             start: { line: 3, column: 4 },
     *             selectorText: "p#content",
     *             formattedCssText: "p#content {\n  color: red;\n }\n"
     *          },
     *          ...
     *         ]
     *       }
     *     ],
     *     unused: [
     *       {
     *         url: "http://example.org/style1.css",
     *         shortUrl: "style1.css",
     *         rules: [ ... ]
     *       }
     *     ]
     *   }
     *
     * @return {Promise.<Object>}   request response
     */
    createPageReport () {
        return this.request('createPageReport')
    }
}
