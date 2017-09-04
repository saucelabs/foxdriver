import Actor from '../actor'
import { transformEvaluateArgs, transformEvaluateScript } from '../utils'

export default class Console extends Actor {
    static listeners = ['PageError', 'ConsoleAPI']

    /**
     * Start the given Web Console listeners.
     *
     * @param  {String[]} listeners  listeners to listen to (default: 'PageError', 'ConsoleAPI')
     * @return {Promise.<Object>}    request response
     */
    startListeners (listeners = Console.listeners) {
        this.isEnabled = true
        return this.request('startListeners', { listeners })
    }

    /**
     * Stop the given Web Console listeners.
     *
     * @param  {String[]} listeners  listeners to stop listen to (default: 'PageError', 'ConsoleAPI')
     * @return {Promise.<Object>}    request response
     */
    stopListeners (listeners = Console.listeners) {
        this.isEnabled = false
        return this.request('stopListeners', { listeners })
    }

    /**
     * Retrieve the cached messages from the server.
     *
     * @param  {String[]}  messageTypes  type of cached message to get (default: 'PageError', 'ConsoleAPI')
     * @return {Promise.<Object>[]}      list of console messages
     */
    async getCachedMessages (messageTypes = Console.listeners) {
        if (!this.isEnabled) {
            throw new Error('Console is not enabled')
        }

        const resp = await this.request('getCachedMessages', { messageTypes })
        return resp.messages
    }

    /**
     * Clear the cache of messages (console API calls only).
     *
     * @return {Promise.<Object>}  request response
     */
    clearMessagesCache () {
        return this.request('clearMessagesCache')
    }

    /**
     * Evaluate a JavaScript expression.
     *
     * @param  {String|Function}  script  js code to evaluate
     * @param  {Object}           args    arguments to pass to the function
     * @return {Promise.<Object, Error>}  result of the js function or an exception if script fails
     */
    async evaluateJS (script, ...args) {
        const argsTransformed = transformEvaluateArgs(args)
        const text = transformEvaluateScript(script, argsTransformed)
        const { result, exception, exceptionMessage } = await this.request('evaluateJS', { text })

        if (exception) {
            throw new Error(exceptionMessage)
        }

        return result
    }

    /**
     * Get Web Console-related preferences on the server.
     *
     * @param  {String[]} preferences  An array with the preferences you want to retrieve.
     * @return {Promise.<Object>[]}    List of preferences
     */
    getPreferences (preferences) {
        return this.request('getPreferences', { preferences })
    }

    /**
     * Set Web Console-related preferences on the server.
     *
     * @param {Object} preferences  An object with the preferences you want to change.
     * @return {Promise.<Object>}   request response
     */
    setPreferences (preferences) {
        return this.request('setPreferences', { preferences })
    }

    /**
     * Autocomplete a JavaScript expression.
     *
     * @param  {String} text      The code you want to autocomplete.
     * @param  {Number} cursor    Cursor location inside the string. Index starts from 0.
     * @return {Promise.<Object>} request response
     */
    autocomplete (text, cursor) {
        return this.request('autocomplete', { text, cursor })
    }

    /**
     * Inspect the properties of an object.
     *
     * @return {Promise.<Object>} request response
     */
    inspectObjectProperties () {
        return this.request('inspectProperties')
    }
}
