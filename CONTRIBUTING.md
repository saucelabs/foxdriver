How to Contribute
=================

Thanks for your interest in Foxdriver. We appreicate all kinds of pull requests and love every contributions from anyone.

# Getting setup

First clone the project:

```sh
$ git clone git@github.com:saucelabs/foxdriver.git
$ cd foxdriver
```

Make sure you have the suggested Node version installed (check [.nvmrc](/.nvmrc)). The easiest way to do so is to install [nvm](https://github.com/creationix/nvm) and call:

```sh
$ nvm use
```

within the root directory. Then install the dependencies:

```sh
npm install
```

# Code reviews

All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

# Code Style

In lieu of a formal styleguide, take care to maintain the existing coding style. Coding style is fully defined in [.eslintrc](/.eslintrc). To check if your changes pass the code style test run:

```sh
$ npm run eslint
```

# Writing documentation

Every new actor or model should contain inline documentation (jsdoc style) in order to generate the docs for them. There is no explicit procedure for that yet. For now just ensure it is complaint with existing standards.

# Writing Tests

All tests are located in the [/test](/test) directory and are run by [Jest](https://facebook.github.io/jest/).

- Every feature should be accompanied by a test
- We enforce 95% test coverage so make sure you test all your branches and functions
- Every public api event/method should be accompanied by a test
- Tests should be hermetic. Tests should not depend on external services.

If you want to run all test call:

```sh
$ npm run test:unit:cover
```

While development you can run these tests every time a change was applied by executing:

```sh
npm run test:unit -- --watch
```
