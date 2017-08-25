import npmlog from 'npmlog'
import pkg from '../package.json'

/**
 * levels that are available from `npmlog`
 */
const NPM_LEVELS = ['silly', 'verbose', 'debug', 'info', 'http', 'warn', 'error', 'chrome', 'firefox']
npmlog.addLevel('debug', 1000, { fg: 'blue', bg: 'black' }, 'dbug')

export default function Logger (component) {
    const wrappedLogger = {}
    const prefix = pkg.name + (component ? `:${component}` : '')

    /**
     * allow access to the level of the underlying logger
     */
    Object.defineProperty(wrappedLogger, 'level', {
        get: () => { return npmlog.level },
        set: (newValue) => { npmlog.level = newValue },
        enumerable: true,
        configurable: true
    })

    /**
     * add all the levels from `npmlog`, and map to the underlying logger
     */
    for (let level of NPM_LEVELS) {
        wrappedLogger[level] = (...args) => {
            if (!process.env.DEBUG) return
            return npmlog[level](prefix, ...args)
        }
    }

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        wrappedLogger.level = 'verbose'
    }

    wrappedLogger.levels = NPM_LEVELS
    return wrappedLogger
}
