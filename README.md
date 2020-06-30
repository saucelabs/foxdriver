Foxdriver
=========

> Foxdriver is a Node library which provides a high-level API to control Firefox over the Remote Debugging Protocol.
> Version 0.4.1 now supports Firefox v77

## Getting Started

### Installation

To use Foxdriver in your project, run:

```sh
$ npm i @benmalka/foxdriver
```

### Usage

The Firefox Remote Debugging Protocol consists of multiple actors that provide different methods. The Foxdriver API allows you to launch a Firefox instance and connects to the protocol interface automatically. From there you can access the methods of all actors.

__Example__ - opening page and get console.logs

```js
import Foxdriver from '@benmalka/foxdriver'

(async () => {
    const { browser, tab } = await Foxdriver.launch({
        url: 'https://www.mozilla.org/en-US'
    });

    // enable actor
    await tab.console.startListeners();
    // wait until page is loaded
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // receive logs and page errors
    const logs = await tab.console.getCachedMessages();
    console.log(logs);

    // close browser
    browser.close();
})()
```

You can also attach yourself to an already running Firefox browser. This requires to start the browser with the `-start-debugger-server=<port>` cli argument and have the following settings set:

- `devtools.chrome.enabled: true`
- `devtools.debugger.prompt-connection: false`
- `devtools.debugger.remote-enabled: true`

To attach yourself to the browser you then need to create a Foxdriver instance with the correct port and host and call the `connect()` method:

```js
import Foxdriver from '@benmalka/foxdriver'

(async () => {
    const { browser, tab } = await Foxdriver.attach('localhost', 9222);
    const preferences = await browser.preference.getAllPrefs();

    // ...
})()
```

## API

- [Foxdriver](#api)
  * [class: Foxdriver](#foxdriver)
    + [Foxdriver.attach(options)](#foxdriverattachhost-port)
    + [Foxdriver.launch(options)](#foxdriverlaunchoptions)
  * [class: Browser](#class-browser)
    + [browser.close()](#close)
    + [browser.preference](/docs/api/actors/preference.md)
    + [browser.actorRegistry](/docs/api/actors/actorRegistry.md)
    + [browser.addons](/docs/api/actors/addons.md)
    + [browser.device](/docs/api/actors/device.md)
    + [browser.heapSnapshotFile](/docs/api/actors/heapSnapshotFile.md)
  * [class: Tab](#class-tab)
    + [tab.attach()](#tabattach)
    + [tab.detach()](#tabdetach)
    + [tab.reload()](#tabreload)
    + [tab.cacheDisabled(disable)](#tabcachedisableddisable)
    + [tab.navigateTo(url)](#tabnavigatetourl)
	+ [tab.onTabNavigated(callback)](#tabontabnavigatedcallback)
    + [tab.console](/docs/api/actors/console.md)
	+ [tab.network](/docs/api/actors/network.md)
	+ [tab.storage](/docs/api/actors/storage.md)
    + [tab.memory](/docs/api/actors/memory.md)
    + [tab.performance](/docs/api/actors/performance.md)
    + [tab.profiler](/docs/api/actors/profiler.md)
    + [tab.timeline](/docs/api/actors/timeline.md)
    + [tab.styleSheets](/docs/api/actors/styleSheets.md)
    + [tab.cssUsage](/docs/api/actors/cssUsage.md)
    + [tab.cssProperties](/docs/api/actors/cssProperties.md)
    + [tab.emulation](/docs/api/actors/emulation.md)
    + [tab.inspector](/docs/api/actors/inspector.md)

### Foxdriver
#### Foxdriver.attach(host, port)
Attaches client to an already running instance.

- `host` `<String>` host where Firefox instance was launched
- `port` `<Number>` port on which the Firefox instance was launched
- returns: `<Promise<Object>>`
    - `tab` `<[Tab]>` list of opened tabs
    - `browser` `<Browser>` browser instance

#### Foxdriver.launch(options)
Attaches client to an already running instance.

- `options` `<Object>`
    - `port` `<Number>` port on which the Firefox instance should get launched
    - `bin` `<String>` path to Firefox binary (default: OS default path)
    - `args` `<[String]>` list of arguments pass to `fs.spawn` (default: `[]`)
- returns: `<Promise<Object>>`
    - `tab` `<Tab>` opened tab
    - `browser` `<Browser>` browser instance

#### class: Browser
##### close()
Disconnects from the browser instance and closes browser if launched via `launch()` method

#### class: Tab
##### tab.attach()
Attaches to this tab
- returns: `<Promise>` fulfills once request was sent

##### tab.detach()
Detaches from this tab
- returns: `<Promise>` fulfills once request was sent

##### tab.reload()
Reloads current page url.
- returns: `<Promise>` fulfills once request was sent

##### tab.cacheDisabled(disable)
Disable cache.
- `disable` `<Boolean>` if true, caching is disbled
- returns: `<Promise>` fulfills once request was sent

##### tab.navigateTo(url)
Navigates to a certain url
- `url` `<String>` url to navigate to
- returns: `<Promise>` fulfills once request was sent

##### tab.onTabNavigated(callback)
Event fired on tab navigation end
- `callback` `<Function>` to be called on event

For more information please see [API docs](/docs).
