/** Shim for ES5 style inheritance support of classes in modern browsers */
export function shimES5Constructor(Class) {
    if (window.Reflect === undefined || typeof Class !== 'function')
        return;
    if (String(Class).indexOf('[native code]') === -1)
        return;
    const constructor = function (...args) {
        return Reflect.construct(Class, args, this.constructor);
    };
    Object.defineProperty(constructor, 'name', { value: Class.name });
    Object.defineProperty(window, Class.name, { value: constructor });
    const Element = window[Class.name];
    Element.prototype = Class.prototype;
    Element.prototype.constructor = Element;
    Object.setPrototypeOf(Element, Class);
}
shimES5Constructor(Event);
shimES5Constructor(HTMLElement);
