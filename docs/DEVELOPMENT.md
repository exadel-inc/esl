# Development guide

This section describes the project structure and our development guidelines.

  - [Setup the project](#setup-the-project)
  - [Project Stack](#project-stack)
  - [Project Structure](#project-structure)
  - [Project Scripts](#project-scripts)
  - [Project Conventions](#project-conventions)
  - [Make or update a core and utilities](#make-or-update-a-core-and-utilities)
  - [Make or update a component](#make-or-update-a-component)
  - [Update demo pages](#update-demo-pages)
    - [Syntax highlighting for IDE](#syntax-highlighting-for-ide)

## Setup the project

1.  To get started you will need Node.js version `>=18.13.0`.

2.  After cloning the repo, run:
    ```commandline
    npm i
    ```
    or
    ```commandline
    npm ci
    ```
    to install dependencies

3.  Use
    ```commandline
    npm run start
    ```
    to start development server. 
    The development server watches source file changes out of the box.


You can create prod output assets in any moment using
```commandline
npm run build
```

Also, you can run tests and lints using
```commandline
npm run test
```

To make sure that all checks are passed before you commit and push your changes,
please make sure that you allow `husky` to set up git hooks for you.


__NOTE__: be aware of the `prepare` step that runs build during `npm i` process.
In case you need to update dependencies in the code version that is broken and 
can not build successfully, use the `--ignore-scripts` param:
```commandline
npm i --ignore-scripts
```

## Project Stack

ESL codebase is written using TypeScript and LESS CSS-preprocessor.

ESL uses the following tools to keep codebase quality
- ESLint to lint scripts
- StyleLint to lint styles
- Jest to run unit tests
- CommitLint to check commit message format

The 11ty project and webpack are used to build a static website for project representation.

The semantic-release project and GitHub actions are used to automate the release process.

## Project Structure

ESL project consists of the following directories:

- [📁 src](../src) - library source code
  - [📁 modules](../src/modules) - library core modules and components
    - [📁 draft](../src/modules/draft) - library core modules and components drafts (not ready for production, out of semiver and restrictions)
    - [📁 esl-component](../src/modules) - library component directory
        - 📁 test - component/module tests sources
            - 📄 *.test.ts - test sources should have `.test` postfix 
        - 📁 core - component/module core source files
        - 📄 core.ts - component/module main file (import core parts)
        - 📄 core.less - component/module main styles
        - 📄 core.mixin.less - component/module main styles mixin and references only
    - [📁 esl-utils](../src/modules/esl-utils) - library common utilities module
        - 📁 category - utilities organized in groups
    - 📄 all.ts - bundled esm source
    - 📄 lib.ts - global object type definition and activator
    - 📄 all.less - bundled source style 
  - [📁 polyfills](../src/polyfills) - small polyfills and shims distributed with the library


- [📁 site](../site) - demo site root directory
  - [📁 11ty](../site/11ty) - demo site 11ty configuration files
    - 📄 *.js - will be applied to 11ty config automatically
    - 📄 _*.js - will not be applied to 11ty configuration
  - [🔨📁 dist](../site/dist) - demo site build output directory
  - [📁 src](../site/src) - demo site common styles and scripts sources
  - [📁 static](../site/static) - demo site common static assets sources
    - [📁 assets](../site/static/assets) - demo site static assets (images, fonts, icons)
    - [📁 tools](../site/static/tools) - common files to configure GH Pages
  - [📁 views](../site/views) - demo pages templates and 11ty common templates
    - [📁 _data](../site/views/_data) - 11ty [global data](https://www.11ty.dev/docs/data-global/) files
    - [📁 _includes](../site/views/_includes) - 11ty templates common parts
    - [📁 _layouts](../site/views/_layouts) - 11ty pages layouts definitions
    - [📁 components](../site/views/components) - ESL components articles
    - [📁 examples](../site/views/examples) - examples articles
    - [📁 core](../site/views/core) - ESL core articles
  - [🔧 .eleventy.js](../site/.eleventy.js) - main 11ty configuration file
  - [🔧 tsconfig.json](../site/tsconfig.json) - TS config for demo pages scripts
  - [🔧 webpack.config.js](../site/webpack.config.js) - webpack build file for demo pages


- [📁 build](../build) - library common build scripts
- [📁 eslint](../eslint) - library es-lint rules configuration
- [📁 .github](../.github) - library repository configuration and documentation
- [📁 .husky](../.husky) - git hooks configuration


- [🔨📁 modules](../modules) - library core esm build output
- [🔨📁 polyfills](../polyfills) - library polyfills esm build output


- [🔨📁 .report](../.report) - linters / test / build-tools reports

## Project Scripts

- `npm start` or `npm run start` - start demo server locally.
  Runs local build, watch and BrowserSync.
  Uses `:3005` port by default.


- `npm run clean` - clear output folders
- `npm run build` - build project to ESM output
- `npm run build-pages` - build project auto-generated GitHub Pages


- `npm test` or `npm run test` - run linters and tests (silent task, used in CI/CD)
- `npm run lint` - run linting
- `npm run test:unit` - run all tests
- `npm run test:report` - run tests and create coverage report

## Project Conventions

ESL project uses some special JS community agreements and name conventions.
To fix and track such agreements the [Code Conventions](CODE_CONVENTIONS.md) document was created.

## Make or update a core and utilities

TODO: Detailed guide will be added in the future based on contribution experience

## Make or update a component

TODO: Detailed guide will be added in the future based on contribution experience

## Update demo pages

The demo site is built with [Eleventy](https://www.11ty.dev/docs/) - a simple static site generator.

[Nunjucks](https://mozilla.github.io/nunjucks/) and [Markdown](https://www.markdownguide.org/) are picked as template languages.

The project is deployed to GitHub Pages using a GitHub workflow.


### Syntax highlighting for IDE

In case you are using JetBrains IDE (IDEA or WebStorm) you need to follow these steps:
1. Add [Twig Support plugin](https://plugins.jetbrains.com/plugin/7303-twig) if necessary
2. Go to File -> Settings -> Editor -> File Types
3. Find Twig and add the custom pattern `*.njk`.
   Now all *.njk files are parsed as Twig, so you have support for Nunjucks.

For Visual Studio Code you can use this [plugin](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks) to support syntax highlighting.
