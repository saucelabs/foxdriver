import Actor from '../actor'
import ActorActor from '../models/actorActor'

/*
 * The ActorRegistryActor allows clients to define new actors on the
 * server. This is particularly useful for addons.
 */
export default class ActorRegistry extends Actor {
    /**
     * register actor to registry
     *
     * @param  {String}  sourceText  source text of actor
     * @param  {String}  filename    file name of actor
     * @param  {Object}  options     actor options
     * @return {Promise}             resolves once request has finished
     */
    async registerActor (sourceText, filename, options) {
        const { actorActor } = this.request('registerActor', { sourceText, filename, options })
        return new ActorActor(this.client, actorActor)
    }
}
