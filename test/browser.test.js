import Browser from './../lib/browser'

let browser
let getTabActorsSpy

beforeEach(async () => {
    browser = new Browser('localhost', 9222)
    getTabActorsSpy = jest.spyOn(browser, "getTabActors");
})

test('should call getTabActors if consoleActor is missing from listTabs', async () => {
    browser.request = jest.fn(function (message) {
        if (message === 'listTabs') {
            return Promise.resolve({
                preferenceActor: 'server1.conn6.preferenceActor2',
                selected: 0,
                tabs: [ { actor: 'server1.conn6.tabDescriptor1', traits: [Object] } ],
                from: 'root'
            });
        } else if (message === 'getTarget') {
            return Promise.resolve({
                frame: {
                    consoleActor: 'server1.conn2.child1/consoleActor2',
                }
            });
        } else {
            return Promise.resolve({});
        }
    });

    const tabList = await browser.listTabs()
    expect(getTabActorsSpy).toHaveBeenCalledTimes(1)
    expect(tabList).toMatchSnapshot()
})

test('should not call getTabActors if consoleActor presents', async () => {
    browser.request = jest.fn(function (message) {
        if (message === 'listTabs') {
            return Promise.resolve({
                preferenceActor: 'server1.conn6.preferenceActor2',
                selected: 0,
                tabs: [ {
                    actor: 'server1.conn2.child1/frameTarget1',
                    consoleActor: 'server1.conn2.child1/consoleActor2',
                } ],
                from: 'root'
            });
        } else {
            return Promise.resolve({});
        }
    });

    const tabList = await browser.listTabs()
    expect(getTabActorsSpy).not.toHaveBeenCalled()
    expect(tabList).toMatchSnapshot()
})
