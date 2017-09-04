import Actor from '../actor'

/**
 * CSSProperties actor
 */
export default class CSSProperties extends Actor {
    /**
     * get css database of current firefox version
     *
     * @return {Promise.<Object>}   request response
     */
    getCSSDatabase () {
        return this.request('getCSSDatabase')
    }
}
