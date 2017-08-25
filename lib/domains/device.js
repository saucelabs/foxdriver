import fs from 'fs'

import Actor from '../actor'
import LongString from '../models/longString'

const dataURLPreamble = 'data:image/png;base64,'

export default class Device extends Actor {
    /**
     * returns general info about browser an OS, e.g.
     * { appid: '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}',
       apptype: 'firefox',
       vendor: 'Mozilla',
       name: 'Firefox',
       version: '55.0.2',
       appbuildid: '20170814073321',
       changeset: '45ab6e362747102d00fd75378727fcddcfd35f44',
       platformbuildid: '20170814073321',
       geckobuildid: '20170814073321',
       platformversion: '55.0.2',
       geckoversion: '55.0.2',
       locale: 'de',
       endianness: 'LE',
       hostname: 'Christian-Bromann-NAT',
       os: 'Darwin',
       platform: 'Darwin',
       hardware: 'unknown',
       arch: 'x86_64',
       processor: 'x86_64',
       compiler: 'gcc3',
       profile: 'firefox_dev_profile-BhzvUp',
       channel: 'release',
       dpi: 258,
       useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0',
       width: 2560,
       height: 1440,
       physicalWidth: 2560,
       physicalHeight: 1440,
       brandName: 'Mozilla Firefox' }
     */
    async getDescription () {
        const { value } = await this.request('getDescription')
        return value
    }

    /**
     * unkown functionality (request doesn't respond)
     */
    async getWallpaper () {
        const { value } = await this.request('getWallpaper')
        return value
    }

    /**
     * returns base64 data url string of the browser screenshot
     */
    async screenshotToDataURL () {
        const { value } = await this.request('screenshotToDataURL')
        const imageBlob = new LongString(this.client, value.actor)
        return imageBlob.substring(0, value.length)
    }

    // HELPER METHODS

    /**
     * Saves browser screenshot to file
     * @param  {String}  path of image file to save the screenshot to (should be PNG)
     * @return {Promise}      resolves once image is written
     */
    async screenshotToFile (path) {
        const dataUrl = await this.screenshotToDataURL()

        console.log(dataUrl.substr(0, dataURLPreamble.length), dataUrl.substr(dataURLPreamble.length, 100));
        return new Promise(
            (resolve, reject) => fs.writeFile(path, dataUrl.substr(dataURLPreamble.length), 'base64', (err) => {
                if (err) {
                    return reject(err)
                }

                return resolve()
            })
        )
    }
}
