import Actor from '../actor'

/**
 * The ActorActor gives you a handle to an actor you've dynamically
 * registered and allows you to unregister it.
 */
export default class ActorActor extends Actor {
    /**
     * unregister actor
     *
     * @return {Promise}   resolves once request has finished
     */
    unregister () {
        return this.request('unregister')
    }
}
