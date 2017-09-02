import Actor from '../actor'
import { transformEvaluateArgs, transformEvaluateScript } from '../utils'

export default class Console extends Actor {
    static listeners = ['PageError', 'ConsoleAPI']

    /**
     * Start the given Web Console listeners.
     *
     * @param array listeners
     *        Array of listeners you want to start. See Console.listeners for
     *        known listeners.
     */
    startListeners (listeners = Console.listeners) {
        this.isEnabled = true
        return this.request('startListeners', { listeners })
    }

    /**
     * Stop the given Web Console listeners.
     *
     * @param array listeners
     *        Array of listeners you want to stop. See Console.listeners for
     *        known listeners.
     */
    stopListeners (listeners = Console.listeners) {
        this.isEnabled = false
        return this.request('stopListeners', { listeners })
    }

    /**
     * Retrieve the cached messages from the server.
     *
     * @param array types
     *        The array of message types you want from the server. See
     *        this.CACHED_MESSAGES for known types.
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
     */
    clearMessagesCache () {
        return this.request('clearMessagesCache')
    }

    /**
     * Evaluate a JavaScript expression.
     *
     * @param string string
     *        The code you want to evaluate.
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
     * @param array preferences
     *        An array with the preferences you want to retrieve.
     */
    getPreferences (preferences) {
        return this.request('getPreferences', { preferences })
    }

    /**
     * Set Web Console-related preferences on the server.
     *
     * @param object preferences
     *        An object with the preferences you want to change.
     */
    setPreferences (preferences) {
        return this.request('setPreferences', { preferences })
    }

    /**
     * Autocomplete a JavaScript expression.
     *
     * @param string string
     *        The code you want to autocomplete.
     * @param number cursor
     *        Cursor location inside the string. Index starts from 0.
     */
    autocomplete (text, cursor) {
        return this.request('autocomplete', { text, cursor })
    }

    /**
     * Inspect the properties of an object.
     */
    inspectObjectProperties () {
        return this.request('inspectProperties')
    }
}
