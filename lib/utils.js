export function addEventListener (emitter, eventName, handler) {
    emitter.on(eventName, handler)
    return { emitter, eventName, handler }
}

export function removeEventListeners (listeners) {
    for (const listener of listeners) {
        listener.emitter.removeListener(listener.eventName, listener.handler)
    }
    listeners.splice(0, listeners.length)
}

export function transformEvaluateArgs (args) {
    args = Array.isArray(args) ? args : [args]
    return JSON.stringify(args.map((arg) => {
        if (typeof arg === 'function') {
            return arg.toString()
        }

        return arg
    }))
}

export function transformEvaluateScript (script, argsTransformed) {
    if (typeof script === 'function') {
        return `(${script}).apply(window, ${argsTransformed})`
    }

    return `(function () { ${script} }).apply(window, ${argsTransformed})`
}
