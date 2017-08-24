import Actor from '../actor'

export default class Preference extends Actor {
    async getBoolPref (value) {
        const response = await this.request('getBoolPref', { value })
        return response.value
    }

    async getCharPref (value) {
        const response = await this.request('getCharPref', { value })
        return response.value
    }

    async getIntPref (value) {
        const response = await this.request('getIntPref', { value })
        return response.value
    }

    async getAllPrefs () {
        const { value } = await this.request('getAllPrefs')
        return value
    }

    setBoolPref (name, value) {
        return this.request('setBoolPref', { name, value })
    }

    setCharPref (name, value) {
        return this.request('setCharPref', { name, value })
    }

    setIntPref (name, value) {
        return this.request('setIntPref', { name, value })
    }

    clearUserPref (name) {
        return this.request('clearUserPref', { name })
    }
}
