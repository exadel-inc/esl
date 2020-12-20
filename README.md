# Exadel Smart Library (ESL) &#9881;

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

ESL is a web components based library that gives you a set of **lightweight**
and **flexible** custom elements to make basic UX modules fast and leave your sites super performable.

## Library Structure
### Components
- ##### [ESL Image](./src/modules/esl-image/README.md)
- ##### [ESL Media](./src/modules/esl-media/README.md)
- ##### [ESL Scrollbar](./src/modules/esl-scrollbar/README.md)

- ##### [ESL Base Popup](./src/modules/esl-base-popup/README.md)
- ##### [ESL Popup](./src/modules/esl-popup/README.md)
- ##### [ESL Trigger](./src/modules/esl-trigger/README.md)
- ##### [ESL Panel](./src/modules/esl-panel/README.md)
- ##### [ESL Tab](./src/modules/esl-tab/README.md)
- ##### [ESL Scrollable Tab](./src/modules/esl-scrollable-tab/README.md)

### Utilities
- ##### [ESL Base Element](./src/modules/esl-base-element/README.md)
- ##### [ESL Media Query](./src/modules/esl-media-query/README.md)
- ##### [ESL Traversing Query](./src/modules/esl-traversing-query/README.md)
- ##### [ESL Utils](./src/modules/esl-utils/README.md)

---

## Browser support & Polyfills

Exadel Smart Library does not have dependencies but uses the following list of native browser features:

- Ecma Script 6 features
  - [Array.from](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (no Iterable Objects support required)
  - [Array.prototype.find](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 
  - [Array.prototype.findIndex](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 
  - [Object.is](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
  - [ES6 Promises](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Web API
  - [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  - [Node.isConnected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)
  - [Element.matches](https://developer.mozilla.org/ru/docs/Web/API/Element/matches)
  - [Element.closest](https://developer.mozilla.org/ru/docs/Web/API/Element/closest)
  - [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute)
  - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
  - [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
  - [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)


All of them are fully supported by modern browsers like Chrome, Firefox, Safari or Edge (>43).

In order to make ESL work in older browsers you can use a "light" polyfills list for IntersectionObserver, ResizeObserver and Custom Elements
(Older versions of Edge and Safari)

Or make the library work in IE11 or Edge (<14) using "full" polyfills list provided.

See more details on what the polyfill approach might look like in the test-server examples.

Also, the library built-in polyfills for some of DOM and ES6 features are available under [./polyfills](./src/polyfills) directory.

---

## Development: NPM scripts
Here is a list of available npm scripts for local development:
 - `npm start` or `npm run start` - start demo server locally. Runs local build, watch and browsersync. 
 Uses `:3001` port (BrowserSync) and `:3002` port (origin).
 - `npm run tar` - build project and tarball archive with npm state of the project
 - `npm run build` - build project to CJS output
 - `npm run clear` - clear output folders
 - `npm test` or `npm run test` - run linters and tests (silent task, used in CI/CD)
 - `npm run test-only` - just run all tests
 - `npm run test-report` - run tests and create coverage report


---

ESL Core Team: [Alexey Stsefanovich](mailto://astsefanovich@exadel.com), [Julia Murashko](mailto://ymurashka@exadel.com), [Yuliya Adamskaya](mailto://yadamska@exadel.com)

ESL Contributors: Aliaksandr Auseyeu, Andrey Belous, Dmytro Shovchko, Dzianis Mantsevich, Natallia Harshunova, Yana Bernatskaya  

**Exadel, Inc.**

[![](docs/images/exadel-logo.png)](https://exadel.com)
