import type {OverrideDecoratorConfig} from '../prop';

export function prop(value: any, prototypeConfig: OverrideDecoratorConfig = {}): Function {
  return function (target: object, {kind, name, addInitializer}: ClassAccessorDecoratorContext): void {
    if (kind !== 'accessor') return;
    addInitializer(function () {
      const proto = Object.getPrototypeOf(this);
      if (Object.hasOwnProperty.call(proto, name)) throw new TypeError('Can\'t override own property');
      Object.defineProperty(proto, name, {
        value,
        writable: !prototypeConfig.readonly,
        enumerable: !prototypeConfig.enumerable,
        configurable: true
      });
    });
  };
}
