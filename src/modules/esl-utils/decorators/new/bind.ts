export function bind(target: Function, context: DecoratorContext) {
  const {name, addInitializer} = context;
  addInitializer(function (this: any) {
    this[name] = this[name].bind(this);
  });
}
