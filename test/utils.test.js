import { spy } from 'sinon'

import {
    transformEvaluateArgs, transformEvaluateScript, addEventListener, removeEventListeners
} from '../lib/utils'

test('transform script properly', () => {
    expect(transformEvaluateScript('foo', 'someargs')).toEqual(
        '(function () { foo }).apply(window, someargs)')
})

test('transform script function properly', () => {
    expect(transformEvaluateScript(() => { return 'foobar' }, 'someargs')).toEqual(
        '(() => {\n    return \'foobar\';\n  }).apply(window, someargs)')
})

test('transform arguments properly', () => {
    const args = transformEvaluateArgs([() => 'foobar', 1, '2', false, [1, 2, 3], {foo: 'bar'}])
    expect(args).toEqual('["() => \'foobar\'",1,"2",false,[1,2,3],{"foo":"bar"}]')
})

test('transform arguments properly if not passed as array', () => {
    const args = transformEvaluateArgs('foobar')
    expect(args).toEqual('["foobar"]')
})

test('creates enhanced listener objects', () => {
    const emitter = { on: spy() }
    const handler = spy()
    addEventListener(emitter, 'foobar', handler)
    expect(emitter.on.calledWith('foobar', handler)).toBe(true)
})

test('unregisteres listener events', () => {
    const emitter = { removeListener: spy(), on: () => {} }
    const handler = spy()
    const listeners = [addEventListener(emitter, 'foobar', handler)]

    removeEventListeners(listeners)
    expect(emitter.removeListener.calledWith('foobar', handler)).toBe(true)
    expect(listeners).toHaveLength(0)
})
