import {toKebabCase} from '../../misc/format';
import {getAttr, setAttr} from '../../dom/attr';

export function attr(cfg?: any) {
  return function (_val: unknown, {kind, name}: DecoratorContext): ClassAccessorDecoratorResult<any, any> {
    if (kind !== 'accessor' || typeof name !== 'string') throw Error('Error');
    const attrName: string = toKebabCase(name);
    return {
      get(): string | null {
        return getAttr(this, attrName);
      },
      set(value: string | null): void {
        return setAttr(this, attrName, value);
      }
    };
  };
}
