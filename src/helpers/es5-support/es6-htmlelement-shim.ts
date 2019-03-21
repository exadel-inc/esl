/**
 * Shim based on https://github.com/webcomponents/custom-elements/blob/master/src/native-shim.js
 *
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *   5. Code inside of eval mustn't be compiled to ES5 syntax
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
// @ts-ignore
if ('customElements' in window && !window.es5HTMLElemeentInheritanceShim) {
  try {
    eval('(()=>{\'use strict\';const a=window.HTMLElement,b=window.customElements.define,' +
      'c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){' +
      'const j=d.get(this.constructor),k=c.call(window.customElements,j);g=!0;const l=new k;return l}f=!1},' +
      'window.HTMLElement.prototype=a.prototype;Object.defineProperty(window,\'customElements\',' +
      '{value:window.customElements,configurable:!0,writable:!0}),Object.defineProperty(window.customElements,' +
      '\'define\',{value:(j,k)=>{const l=k.prototype,m=class extends a{constructor(){super(),Object.setPrototypeOf(this,l),' +
      'g||(f=!0,k.call(this)),g=!1}},n=m.prototype;m.observedAttributes=k.observedAttributes,' +
      'n.connectedCallback=l.connectedCallback,n.disconnectedCallback=l.disconnectedCallback,' +
      'n.attributeChangedCallback=l.attributeChangedCallback,n.adoptedCallback=l.adoptedCallback,d.set(k,j),' +
      'e.set(j,k),b.call(window.customElements,j,m)},configurable:!0,writable:!0}),Object.defineProperty(' +
      'window.customElements,\'get\',{value:j=>e.get(j),configurable:!0,writable:!0})})();');
    // @ts-ignore-file
    window.es5HTMLElemeentInheritanceShim = true;
  } catch (e) {
    //
  }
}
