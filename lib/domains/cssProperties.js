import Actor from '../actor'

export default class CSSProperties extends Actor {
    getCSSDatabase () {
        return this.request('getCSSDatabase')
    }
}
