const originalAssignFn = Object.assign;
Object.defineProperty(Object, 'assign', {writable: true, value: undefined});
import '../list/es6.object.assign';

class TestError extends Error {}

afterAll(() => {
  Object.assign = originalAssignFn;
});

describe('Object.assign() polyfill', () => {
  test('object override sameproperty', () => {
    // Object properties are assigned to target in ascending index order,
    // i.e. a later assignment to the same property overrides an earlier assignment.
    const target = {a: 1};
    const result = Object.assign(target, {a: 2}, {a: 'c'});
    expect(result.a).toBe('c');
  });

  test('only one argument', () => {
    // Should return ToObject(target)
    const target = 'a';
    const result = Object.assign(target as any);
    expect(typeof result).toBe('object');
    expect(result.valueOf()).toEqual('a');
  });

  test('override notstringtarget', () => {
    // Every string from sources will be wrapped to objects, and override from the first letter(result[0]) all the time
    const target = 12;
    const result = Object.assign(target, 'aaa', 'bb2b', '1c');
    expect(Object.getOwnPropertyNames(result).length).toBe(4);
    expect(result[0]).toBe('1');
    expect(result[1]).toBe('c');
    expect(result[2]).toBe('2');
    expect(result[3]).toBe('b');
  });

  test('override', () => {
    const target = {a: 1};
    /*
    '1a2c3' have own enumerable properties, so it Should be wrapped to objects;
    {b:6} is an object,should be assigned to final object.
    undefined and null should be ignored;
    125 is a number,it cannot has own enumerable properties;
    {a:'c'},{a:5} will override property a, the value should be 5.
    */
    const result = Object.assign(
      target,
      '1a2c3',
      {a: 'c'},
      undefined,
      {b: 6},
      null,
      125,
      {a: 5}
    );
    expect(Object.getOwnPropertyNames(result).length).toBe(7);
    expect(result.a).toBe(5);
    expect(result[0]).toBe('1');
    expect(result[1]).toBe('a');
    expect(result[2]).toBe('2');
    expect(result[3]).toBe('c');
    expect(result[4]).toBe('3');
    expect(result.b).toBe(6);
  });

  test('source is Null Undefined', () => {
    const target = new Object();
    // null and undefined source should be ignored, result should be original object.
    const result = Object.assign(target, undefined, null);
    expect(result).toEqual(target);
  });

  test('source is Number Boolean Symbol', () => {
    const target = new Object();
    /*
    Number, Boolean, and Symbol cannot have their own enumerable properties,
    so cannot be Assigned. Here result should be the original object.
    */
    const result = Object.assign(target, 123, true, Symbol('foo'));
    expect(result).toEqual(target);
  });

  test('source is String', () => {
    const target = new Object();
    // string have own enumerable properties, so it can be wrapped to objects.
    const result = Object.assign(target, '123');
    expect(result[0]).toBe('1');
    expect(result[1]).toBe('2');
    expect(result[2]).toBe('3');
  });

  test('target is Boolean', () => {
    // if target is Boolean,the return value should be a new object whose value is target.
    const result = Object.assign(true, {a: 2});
    expect(typeof result).toBe('object');
    expect(result.valueOf()).toEqual(true);
  });

  test('target is Null', () => {
    // if target is null, should throw a TypeError exception.
    // @ts-ignore
    expect(() => Object.assign(null, {a: 1})).toThrow(TypeError);
  });

  test('target is Number', () => {
    // if target is Number, the return value should be a new object whose value is target.
    const result = Object.assign(1, {a: 2});
    expect(typeof result).toBe('object');
    expect(result.valueOf()).toEqual(1);
  });

  test('target is Object', () => {
    const target = {foo: 1};
    // if target is Object, its properties will be the properties of new object.
    const result = Object.assign(target, {a: 2});
    expect(typeof result).toBe('object');
    expect(result.a).toEqual(2);
    expect(result.foo).toEqual(1);
  });

  test('target is String', () => {
    // if target is String, the return value should be a new object whose value is target.
    const result = Object.assign('1', {a: 2});
    expect(typeof result).toBe('object');
    expect(result.valueOf()).toEqual('1');
  });

  test('target is Symbol', () => {
    // if target is Symbol, the return value should be a new Symbol object whose [[SymbolData]] value is target.
    const target = Symbol('foo');
    const result = Object.assign(target, {a: 1});
    expect(typeof result).toBe('object');
    expect(result.toString()).toEqual('Symbol(foo)');
  });

  test('target is Undefined', () => {
    // if target is Undefined, should throw a TypeError exception.
    // @ts-ignore
    expect(() => Object.assign(undefined, {a: 1})).toThrow(TypeError);
  });

  test('assign descriptor', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Object, 'assign');
    expect(descriptor).toHaveProperty('writable', true);
    expect(descriptor).toHaveProperty('enumerable', false);
    expect(descriptor).toHaveProperty('configurable', true);
  });

  test('assignment to readonly property of target must throw a typeerror exception', () => {
    // Assignment to readonly property of target must throw a TypeError exception
    expect(() => Object.assign('a', [1])).toThrow(TypeError);
  });

  test('invoked as constructor', () => {
    /*
    Built-in function objects that are not identified as constructors do not
    implement the [[Construct]] internal method unless otherwise specified in
    the description of a particular function.
    */
    expect(() => {
      // @ts-ignore
      new Object.assign({});
    }).toThrow(TypeError);
  });

  test('assign name', () => {
    /*
    ES6 Section 17:
    Every built-in Function object, including constructors, that is not
    identified as an anonymous function has a name property whose value is a
    String. Unless otherwise specified, this value is the name that is given to
    the function in this specification.
    [...]
    Unless otherwise specified, the name property of a built-in Function
    object, if it exists, has the attributes { [[Writable]]: false,
    [[Enumerable]]: false, [[Configurable]]: true }.
    */
    expect(Object.assign.name).toBe('assign');
    const descriptor = Object.getOwnPropertyDescriptor(Object.assign, 'name');
    expect(descriptor).toHaveProperty('writable', false);
    expect(descriptor).toHaveProperty('enumerable', false);
    expect(descriptor).toHaveProperty('configurable', true);
  });

  test('source - get attributes error', () => {
    // Errors thrown during retrieval of source object attributes
    const source = {
      get attr() {
        throw new TestError();
      }
    };
    expect(() => Object.assign({}, source)).toThrow(TestError);
  });

  test('source - non-enumerable', () => {
    // Does not assign non-enumerable source properties
    const target = {};
    const source = Object.defineProperty({}, 'attr', {value: 1, enumerable: false});
    const result = Object.assign(target, source);

    expect(Object.hasOwnProperty.call(target, 'attr')).toBe(false);
    expect(result).toEqual(target);
  });

  test('source - own property error', () => {
    // Invoked with a source whose own property descriptor cannot be retrieved
    const source = new Proxy(
      {
        attr: null
      },
      {
        getOwnPropertyDescriptor: () => {
          throw new TestError();
        }
      }
    );
    expect(() => Object.assign({}, source)).toThrow(TestError);
  });

  test('source - own property keys error', () => {
    // Invoked with a source whose own property keys cannot be retrieved
    const source = new Proxy(
      {},
      {
        ownKeys: () => {
          throw new TestError();
        }
      }
    );
    expect(() => Object.assign({}, source)).toThrow(TestError);
  });

  test('strings and symbol order', () => {
    // Symbol-valued properties are copied after String-valued properties.
    const log: string[] = [];
    const sym1 = Symbol('x');
    const sym2 = Symbol('y');
    const source = {};

    Object.defineProperty(source, sym1, {
      get: () => log.push('get sym(x)'),
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(source, 'a', {
      get: () => log.push('get a'),
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(source, sym2, {
      get: () => log.push('get sym(y)'),
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(source, 'b', {
      get: () => log.push('get b'),
      enumerable: true,
      configurable: true
    });

    Object.assign({}, source);
    expect(log).toEqual(['get a', 'get b', 'get sym(x)', 'get sym(y)']);
  });

  test('target is frozen accessor property set succeeds', () => {
    // [[Set]] to accessor property of frozen `target` succeeds.
    let value1 = 1;
    const target1 = {
      set foo(val: any) {
        value1 = val;
      }
    };
    Object.freeze(target1);
    Object.assign(target1, {foo: 2});
    expect(value1).toBe(2);

    const sym = Symbol();
    let value2 = 1;
    const target2 = Object.freeze({
      set [sym](val: any) {
        value2 = val;
      }
    });
    Object.freeze(target2);
    Object.assign(target2, {[sym]: 2});
    expect(value2).toBe(2);
  });

  test('target is frozen data property set throws', () => {
    // [[Set]] to data property of frozen `target` fails with TypeError.
    const sym = Symbol();
    const target1 = {[sym]: 1};
    Object.freeze(target1);
    expect(() => Object.assign(target1, {[sym]: 1})).toThrow(TypeError);

    const target2 = Object.freeze({foo: 1});
    expect(() => Object.assign(target2, {foo: 1})).toThrow(TypeError);
  });

  test('target is non extensible existing accessor property', () => {
    // [[Set]] to existing accessor property of non-extensible `target` is successful.
    let value1 = 1;
    const target1 = Object.preventExtensions({
      set foo(val: any) {
        value1 = val;
      }
    });
    Object.assign(target1, {foo: 2});
    expect(value1).toBe(2);

    const sym = Symbol();
    let value2 = 1;
    const target2 = {
      set [sym](val: any) {
        value2 = val;
      }
    };
    Object.preventExtensions(target2);
    Object.assign(target2, {[sym]: 2});
    expect(value2).toBe(2);
  });

  test('target is non extensible existing data property', () => {
    // [[Set]] to existing data property of non-extensible `target` is successful.
    const target1 = Object.preventExtensions({foo: 1});
    Object.assign(target1, {foo: 2});
    expect(target1.foo).toBe(2);

    const sym = Symbol();
    const target2 = {[sym]: 1};
    Object.preventExtensions(target2);
    Object.assign(target2, {[sym]: 2});
    expect(target2[sym]).toBe(2);
  });

  test('target is non-extensible property creation throws', () => {
    // [[Set]] to non-existing property of non-extensible `target` fails with TypeError.
    const target1 = Object.preventExtensions({foo: 1});
    expect(() =>
      Object.assign(target1, {
        get bar() {
          return;
        }
      })
    ).toThrow(TypeError);

    const target2 = {};
    Object.preventExtensions(target2);
    expect(() => Object.assign(target2, {[Symbol()]: 1})).toThrow(TypeError);
  });

  test('target is sealed existing accessor property', () => {
    // [[Set]] to existing accessor property of sealed `target` is successful.
    let value1 = 1;
    const target1 = Object.seal({
      set foo(val: any) {
        value1 = val;
      }
    });
    Object.assign(target1, {foo: 2});
    expect(value1).toBe(2);

    const sym = Symbol();
    let value2 = 1;
    const target2 = {
      set [sym](val: any) {
        value2 = val;
      }
    };
    Object.seal(target2);
    Object.assign(target2, {[sym]: 2});
    expect(value2).toBe(2);
  });

  test('target is sealed existing data property', () => {
    // [[Set]] to existing data property of sealed `target` is successful.
    const target1 = Object.seal({foo: 1});
    Object.assign(target1, {foo: 2});
    expect(target1.foo).toBe(2);

    const sym = Symbol();
    const target2 = {[sym]: 1};
    Object.seal(target2);
    Object.assign(target2, {[sym]: 2});
    expect(target2[sym]).toBe(2);
  });

  test('target is sealed property creation throws', () => {
    // [[Set]] to non-existing property of sealed `target` fails with TypeError.
    const target1 = Object.seal({foo: 1});
    expect(() =>
      Object.assign(target1, {
        get bar() {
          return;
        }
      })
    ).toThrow(TypeError);

    const target2 = {};
    Object.seal(target2);
    expect(() => Object.assign(target2, {[Symbol()]: 1})).toThrow(TypeError);
  });

  test('target set not-writable', () => {
    // Errors thrown during definition of target object attributes
    const target = {};
    Object.defineProperty(target, 'attr', {writable: false});
    expect(() => Object.assign(target, {attr: 1})).toThrow(TypeError);
  });

  test('target set user error', () => {
    // Errors thrown during definition of target object attributes
    const target = {};
    Object.defineProperty(target, 'attr', {
      set: (_) => {
        throw new TestError();
      }
    });
    expect(() => Object.assign(target, {attr: 1})).toThrow(TestError);
  });

  test('prototype pollution via __proto__', () => {
    const maliciousPayload = '{"a": 1, "__proto__": {"polluted": true}}';
    const a: any = {};
    const result = Object.assign({}, JSON.parse(maliciousPayload));

    expect(({} as any).polluted).not.toBe(true); // safe Plain Old Javascript Object
    expect(a.polluted).not.toBe(true); // safe a input
    expect(result.polluted).toBe(true);
  });

  test('prototype pollution via constructor', () => {
    const maliciousPayload = '{"a": 1, "constructor": {"prototype": {"polluted": true}}}';
    const a: any = {};
    const result = Object.assign({}, JSON.parse(maliciousPayload));

    expect(result.constructor.prototype.polluted).toBe(true);
    expect(a.constructor.prototype.polluted).toBe(undefined);
    expect(({} as any).constructor.prototype.polluted).toBe(undefined);
  });
});
