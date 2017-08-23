import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import { spawn } from 'child_process'

import getPort from 'get-port'
import { check } from 'tcp-port-used'

import Client from './'
import { addEventListener, removeEventListeners } from './utils'

const CONNECTION_TIMEOUT = 10000
const CONNECTION_INTERVAL = 250
const FIREFOX_PROFILE_PATH = path.join(os.tmpdir(), 'firefox_dev_profile-')

export default class Launcher {
    static async launch (options = {}) {
        const host = '127.0.0.1'
        const listeners = []
        const debuggerPort = await getPort({ port: options.port || 9222 })

        /**
         * create custom profile
         */
        const profileDir = fs.mkdtempSync(FIREFOX_PROFILE_PATH)
        fs.copySync(path.resolve(__dirname, 'config', 'profile', 'prefs.js'), path.resolve(profileDir, 'prefs.js'))

        const firefoxExecuteable = options.bin || Launcher.getFirefoxBin()
        const firefoxArguments = (options.args || []).concat(
            '-start-debugger-server', debuggerPort,
            '-url', options.url || 'https://google.com',
            '-override', path.resolve(__dirname, 'config', 'override.ini'),
            '-profile', profileDir
        )
        const firefoxProcess = spawn(firefoxExecuteable, firefoxArguments, {})

        function killAndCleanup () {
            removeEventListeners(listeners);
            firefoxProcess.kill('SIGKILL');
        }

        listeners.push(addEventListener(process, 'exit', killAndCleanup))
        listeners.push(addEventListener(firefoxProcess, 'exit', killAndCleanup))

        await Launcher.waitUntilConnected(host, debuggerPort)
        const client = new Client(host, debuggerPort)
        await client.connect()
        return await Launcher.waitForTab(client)
    }

    static getFirefoxExe () {
        // Only run these checks on win32
        if (process.platform !== 'win32') {
            return null
        }

        const suffix = '\\Mozilla\\firefox.exe'
        const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]

        let windowsFirefoxDirectory
        for (const prefix of prefixes) {
            try {
              windowsFirefoxDirectory = path.join(prefix, suffix)
              fs.accessSync(windowsFirefoxDirectory)
              return windowsFirefoxDirectory
            } catch (e) {}
        }

        return windowsFirefoxDirectory
    }

    static getFirefoxBin () {
        if (process.platform === 'win32') {
            return Launcher.getFirefoxExe()
        }

        if (process.platform === 'darwin') {
            return '/Applications/Firefox.app/Contents/MacOS/firefox'
        }

        if (process.platform !== 'linux') {
            return 'google-chrome'
        }

        throw new Error(`Couldn't find executable for platform "${process.platform}"`)
    }

    static async waitUntilConnected (host, port, timeout = CONNECTION_TIMEOUT) {
        const isConnected = await check(port, host)
        if (isConnected) {
            return true
        }

        await new Promise((resolve) => setTimeout(resolve, CONNECTION_INTERVAL))
        return Launcher.waitUntilConnected(host, port, timeout - CONNECTION_INTERVAL)
    }

    static async waitForTab (client) {
        const tabs = await client.listTabs()
        if (tabs.length > 0) {
            return { client, tab: tabs[0] }
        }

        await new Promise((resolve) => setTimeout(resolve, CONNECTION_INTERVAL))
        return Launcher.waitForTab(client)
    }
}
