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

1.  To get started you will need Node.js version `>=20.8.1` and NPM version `>=9.0.0`. 

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
- Own ESLint shared configuration (see [eslint-config](../packages/eslint-config) sub-package)
- StyleLint to lint styles
- Jest to run unit tests
- CommitLint to check commit message format

The 11ty project and webpack are used to build a static website for project representation.

The semantic-release project and GitHub actions are used to automate the release process.

## Project Structure

ESL project is a monorepo that consists of several packages and directories.
ESL uses Lerna to manage monorepo packages, their dependencies, versioning, publishing, and running scripts.
ESL top-level directory structure is as follows:

- [📁 packages](../packages) - ESL monorepo root
  - [📁 esl](../packages/esl) - ESL library source code
    - [📁 src](../packages/esl/src) - library core modules and components
      - [📁 esl-component](../packages/esl/src/esl-base-element) - library component directory
          - 📁 test - component/module tests sources
              - 📄 *.test.ts - test sources should have `.test` postfix 
          - 📁 core - component/module core source files
          - 📄 core.ts - component/module main file (import core parts)
          - 📄 core.less - component/module main styles
          - 📄 core.mixin.less - component/module main styles mixin and references only
      - [📁 esl-utils](../packages/esl/src/esl-utils) - library common utilities module
          - 📁 category - utilities organized in groups
      - 📄 all.ts - bundled esm source
      - 📄 lib.ts - global object type definition and activator
      - 📄 all.less - bundled source style 
    - [📁 polyfills](../packages/esl/src/polyfills) - (Legacy) small polyfills and shims distributed with the library
  - [📁 site](../packages/esl-website) - demo site root directory
    - [📁 11ty](../packages/esl-website/11ty) - demo site 11ty configuration files
      - 📄 *.js - will be applied to 11ty config automatically
      - 📄 _*.js - will not be applied to 11ty configuration
    - [🔨📁 dist](../packages/esl-website/dist) - demo site build output directory
    - [📁 src](../packages/esl-website/src) - demo site common styles and scripts sources
    - [📁 static](../packages/esl-website/static) - demo site common static assets sources
      - [📁 assets](../packages/esl-website/static/assets) - demo site static assets (images, fonts, icons)
      - [📁 tools](../packages/esl-website/static/tools) - common files to configure GH Pages
    - [📁 views](../packages/esl-website/views) - demo pages templates and 11ty common templates
      - [📁 _data](../packages/esl-website/views/_data) - 11ty [global data](https://www.11ty.dev/docs/data-global/) files
      - [📁 _includes](../packages/esl-website/views/_includes) - 11ty templates common parts
      - [📁 _layouts](../packages/esl-website/views/_layouts) - 11ty pages layouts definitions
      - [📁 components](../packages/esl-website/views/components) - ESL components articles
      - [📁 examples](../packages/esl-website/views/examples) - examples articles
      - [📁 core](../packages/esl-website/views/core) - ESL core articles
    - [🔧 .eleventy.js](../packages/esl-website/.eleventy.js) - main 11ty configuration file
    - [🔧 tsconfig.json](../packages/esl-website/tsconfig.json) - TS config for demo pages scripts
    - [🔧 webpack.config.js](../packages/esl-website/webpack.config.js) - webpack build file for demo pages

  - [📁 eslint-plugin](../packages/eslint-plugin) - sub-package root for ESL ESLint plugin 
    - [📁 src](../packages/eslint-plugin/src) - ESLint plugin sources
    - [📁 test](../packages/eslint-plugin/test) - ESLint plugin tests
  - [📁 eslint-config](../packages/eslint-config) - sub-package root for ESL ESLint shared configuration
    - [📁 rules](../packages/eslint-config/rules) - ESLint shared configuration rule sets
    - [📄 index.js](../packages/eslint-config/index.js) - ESLint shared configuration main file
  - [📁 stylelint-config](../packages/stylelint-config) - sub-package root for ESL StyleLint shared configuration
    - [📁 custom](../packages/eslint-config/custom) - custom StyleLint plugins/rules directory
    - [📄 index.js](../packages/stylelint-config/index.js) - StyleLint shared configuration main file

- [📁 scripts](../scripts) - library common build scripts
- [📁 .github](../.github) - library repository configuration and documentation
- [📁 .husky](../.husky) - git hooks configuration

## Project Scripts

- `npm start` or `npm run start` - start demo server locally.
  Runs local build, watch and BrowserSync.
  Uses `:3005` port by default.
- `npm run clean` - clear output folders
- `npm run build` - build project
- `npm test` or `npm run test` - run linters and tests (silent task, used in CI/CD)
- `npm run lint` - run linting

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
