import Actor from '../actor'

/**
 * Actor to manage browser preferences.
 */
export default class Preference extends Actor {
    /**
     * Get boolean preference.
     *
     * @param  {String}  value    name of preference
     * @return {Promise.Boolean}  preference value
     */
    async getBoolPref (value) {
        const response = await this.request('getBoolPref', { value })
        return response.value
    }

    /**
     * Get char preference.
     *
     * @param  {String}  value  name of preference
     * @return {Promise.Char}   preference value
     */
    async getCharPref (value) {
        const response = await this.request('getCharPref', { value })
        return response.value
    }

    /**
     * Get integer preference.
     *
     * @param  {String}  value    name of preference
     * @return {Promise.Number}   preference value
     */
    async getIntPref (value) {
        const response = await this.request('getIntPref', { value })
        return response.value
    }

    /**
     * Get all preferences.
     *
     * @return {Promise.Object[]}  list of preferences
     */
    async getAllPrefs () {
        const { value } = await this.request('getAllPrefs')
        return value
    }

    /**
     * Set boolean preference.
     *
     * @param {String}  name   preference name
     * @param {Boolean} value  preference value
     * @return {Promise}       request response
     */
    setBoolPref (name, value) {
        return this.request('setBoolPref', { name, value })
    }

    /**
     * Set char preference.
     *
     * @param {String}  name   preference name
     * @param {Char}    value  preference value
     * @return {Promise}       request response
     */
    setCharPref (name, value) {
        return this.request('setCharPref', { name, value })
    }

    /**
     * Set integer preference.
     *
     * @param {String}  name   preference name
     * @param {Number}  value  preference value
     * @return {Promise}       request response
     */
    setIntPref (name, value) {
        return this.request('setIntPref', { name, value })
    }

    /**
     * Clear user set preference
     * @param  {Srting} name  name of preference
     * @return {Promise}      request response
     */
    clearUserPref (name) {
        return this.request('clearUserPref', { name })
    }
}
