import Actor from './actor'

export default class Tab extends Actor {
    get console () { return this._get('console') }
    get network () { return this._get('console', 'network') }
    get memory () { return this._get('memory') }
    get performance () { return this._get('performance') }
    get profiler () { return this._get('profiler') }
    get timeline () { return this._get('timeline') }
    get styleSheets () { return this._get('styleSheets') }
    get cssUsage () { return this._get('cssUsage') }
    get cssProperties () { return this._get('cssProperties') }
    get emulation () { return this._get('emulation') }
    get inspector () { return this._get('inspector') }

    attach () {
        return this.request('attach')
    }

    detach () {
        return this.request('detach')
    }

    reload () {
        return this.request('reload')
    }

    navigateTo (url) {
        return this.request('navigateTo', { url })
    }
}
