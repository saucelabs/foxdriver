Foxdriver
=========

> Foxdriver is a Node library which provides a high-level API to control Firefox over the Remote Debugging Protocol.

## Getting Started

### Installation

To use Foxdriver in your project, run:

```
yarn add foxdriver
# or
npm i foxdriver
```

### Usage

The Firefox Remote Debugging Protocol consists of multiple actors that provide different methods. The Foxdriver API allows you to launch a Firefox instance and connects to the protocol interface automatically. From there you can access the methods of all actors.

__Example__ - opening page and get console.logs

```js
import Foxdriver from 'foxdriver'

(async () => {
    const { browser, tab } = await Foxdriver.launch({
        url: 'https://www.mozilla.org/en-US'
    })

    // enable actor
    await tab.console.enable()
    const logs = await tab.console.getLogs()
    console.log(logs)
})()
```

## API

TBD
