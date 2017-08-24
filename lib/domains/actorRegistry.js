import Actor from '../actor'
import ActorActor from '../models/actorActor'

export default class ActorRegistry extends Actor {
    async registerActor (sourceText, filename, options) {
        const { actorActor } = this.request('registerActor', { sourceText, filename, options })
        return new ActorActor(this.client, actorActor)
    }
}
