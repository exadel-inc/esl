# Installation Guide

<a name="content"></a>

1. Preconditions:  
  Make sure you have all the needed polyfills to support browsers from your browser-support list. 
    - See [Browser support & Polyfills](./BROWSER_SUPPORT.md) for details.
    - Use bundler to build your project. Currently, only ESL modules are available for consumption.

2. Install esl [npm dependency](https://www.npmjs.com/package/@exadel/esl):
   ```bash
   npm i @exadel/esl --save
   ```

3. Import Components/Modules you need.
   - core module entry usually represents main part of the module
   ```typescript
   import '@exadel/esl/modules/esl-component/core';
   ```
   - include optional sub-features directly. See component's documentation for details.
   ```typescript
   import '@exadel/esl/modules/esl-media/providers/iframe-provider';
   ```
   - some modules contain cumulative `all.js` entries.

4. Styles are distributed in two versions:
   - 'ready to use' `core.css` or `core.less`
   - mixin version core.mixin.less for custom tag name definition

5. _[Optional]_ Setup environment configuration, e.g. custom screen breakpoints.
   ```typescript
   import {ESLMediaBreakpoints} from '@exadel/esl/modules/esl-media-query/core';
   // define XS screen breakpoint for up to 800px screen width
   ESLMediaBreakpoints.addCustomBreakpoint('XS', 1, 800);
   ```

6. Register components via register static method call
   ```typescript
   ESLImage.register();
   ```
   You can pass custom tags name to the 'register' function, but use this option only in an exceptional situation.
