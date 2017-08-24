import Actor from '../actor'

export default class ActorActor extends Actor {
    unregister () {
        return this.request('unregister')
    }
}
