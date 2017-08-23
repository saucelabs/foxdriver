import Actor from '../actor'

export default class CSSUsage extends Actor {
    start (url = false) {
        return this.request('start', { url })
    }

    stop () {
        return this.request('stop')
    }

    toggle () {
        return this.request('toggle')
    }

    oneshot () {
        return this.request('oneshot')
    }

    async createEditorReport (url) {
        const { reports } = await this.request('createEditorReport', { url })
        return reports
    }

    async createEditorReportForSheet (url) {
        const { reports } = await this.request('createEditorReportForSheet', { url })
        return reports
    }

    createPageReport () {
        return this.request('createPageReport')
    }

    async _testOnlyVisitedPages () {
        const { value } = await this.request('_testOnlyVisitedPages')
        return value
    }
}
