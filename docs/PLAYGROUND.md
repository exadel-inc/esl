**UI playground** (UIP) is a library designed to enable developers to present, play with, and demonstrate various components. It provides a structured interface to manipulate component settings, adjust markup, and showcase visual outputs in a controlled environment.

<div style="display: flex; justify-content: center; align-items: center; height: 200px;">
  <div style="width: 150px;">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 242 242">
      <path d="M 237,121 A 116,116 0 1,1 5,121 A 116,116 0 1,1 237,121 M 225,121 A 96,96 0 1,0 17,121 A 96,96 0 1,0 225,121 Z"/>
      <path
            d="M77.308 93.97 50.53 120.75l26.95 26.949a8 8 0 0 1-11.315 11.314l-32.508-32.509a8 8 0 0 1 0-11.313c.418-.418.87-.78 1.348-1.086a8.028 8.028 0 0 1 1.37-1.827l29.62-29.62A8 8 0 0 1 77.308 93.97ZM143.992 97.124l-13.856-8-30 51.962 13.856 8 30-51.962ZM99.136 142.818l13.856 8-14.928 9.856 1.073-17.856ZM144.064 81a8 8 0 0 0-10.928 2.928l-2 3.464 13.856 8 2-3.464A7.998 7.998 0 0 0 144.064 81ZM207.124 127.564a8 8 0 0 0 1.348-12.398l-32.509-32.51a8 8 0 0 0-11.314 11.315l26.95 26.949-26.778 26.778a8 8 0 0 0 11.313 11.314l29.621-29.62a8.007 8.007 0 0 0 1.369-1.828Z"/>
    </svg>
  </div>
</div>

UIP is ideal for building interactive markups, live demos, allowing users to fine-tune settings and visualize changes in real-time.

---

## Getting Started

---

### Installation

Install UIPlayground [npm dependency](https://www.npmjs.com/package/@exadel/ui-playground)
   ```bash
   npm i @exadel/ui-playground --save
   ```
Run initialization function
   ```javascript
   import {init} from '@exadel/ui-playground/dist/registration.js';
   init();
   ```
Import CSS styles
   ```css
   @import "@exadel/ui-playground/dist/registration.css";
   ```

---

### Project Structure

UI playground components are divided into two main categories: **Core Components** and **Plugins**. The whole list of available components is described [here](/playground/components/).

UIP must have at least **Сore** components. **Plugins** are
optional, you can add them on your own free will.

To implement custom UIPlayground components, see [UIPPlugin](/playground/components/core/#uip-plugin).

---

## Live example

---

Explore a live demonstration of UI Playground's capabilities below. For more comprehensive examples, visit the [Examples Library](/playground/examples/).