import {bind} from '../bind';

describe('Common @bind decorator test', () => {
  describe('Basic binding tests', () => {
    class Test {
      @bind
      getThis() {
        return this;
      }
    }
    const instance1 = new Test();
    const instance2 = new Test();

    test(
      'Decorated method accessed from instance has bound context',
      () => expect(instance1.getThis.call(null)).toBe(instance1)
    );
    test(
      'Decorated method second access from instance has bound context',
      () => expect(instance1.getThis.call(null)).toBe(instance1)
    );
    test(
      'Decorated method from another instance bound correctly',
      () => expect(instance2.getThis.call(null)).toBe(instance2)
    );

    test(
      'Bounded methods accessing uses cache to return the same function instance',
      () => expect(instance1.getThis).toBe(instance1.getThis)
    );
    test(
      'Bounded methods accessing should not return bounded function of another instance',
      () => expect(instance1.getThis).not.toBe(instance2.getThis)
    );
  });

  describe('Basic context test', () => {
    class Test {
      constructor(public name: string) {}
      @bind
      getThisName(): any {
        return this.name;
      }
    }

    test(
      'Context of bounded method saved if method called outside',
      () => {
        const instance = new Test('1');
        const cb = instance.getThisName;
        expect(cb()).toBe('1');
      }
    );
  });

  describe('Inheritance basic binding test', () => {
    class TestParent {
      @bind getThis() {
        return this;
      }
    }
    class TestChild extends TestParent {
    }

    const instance = new TestChild();

    test(
      'Instance of inherited class has bounded method',
      () => expect(instance.getThis.call(null)).toBe(instance)
    );
    test(
      'Inherited bounded method saves context on the second call',
      () => expect(instance.getThis.call(null)).toBe(instance)
    );
    test(
      'Accessing bound inherited method returns the same method instance',
      () => expect(instance.getThis).toBe(instance.getThis)
    );
  });

  describe('Prototype access should return original method', () => {
    class Test {
      @bind getThis() {
        return this;
      }
    }
    const instance1 = new Test();
    test(
      'Prototype method direct call uses undecorated method',
      () => expect(Test.prototype.getThis.call(instance1)).toBe(instance1)
    );

    const instance2 = new Test();
    test(
      'Attempt to call prototype method second time still respects the context',
      () => expect(Test.prototype.getThis.call(instance2)).toBe(instance2)
    );
  });

  test('Bound method can be overwritten', () => {
    class Test {
      @bind getThis() {
        return this;
      }
    }
    const instance1 = new Test();
    const instance2 = new Test();
    expect(instance1.getThis.call(null)).toBe(instance1);
    instance1.getThis = () => instance2;
    expect(instance1.getThis.call(null)).toBe(instance2);
  });

  describe('Inheritance super keyword should return original method', () => {
    class TestParent {
      public postfix: string;
      @bind getThisName(): any {
        return 'Hello' + (this.postfix || '');
      }
    }
    class TestChild extends TestParent {
      @bind
      override getThisName() {
        return super.getThisName() + ' world';
      }
      getThisSuperName() {
        return super.getThisName();
      }
      getThisSuperNameMethod() {
        return super.getThisName;
      }
    }

    const instance = new TestChild();
    test(
      'Method override can access super method definition',
      () => expect(instance.getThisName()).toBe('Hello world')
    );
    test(
      'Overridden method accessing super method definition, itself bound correctly',
      () => expect(instance.getThisName()).toBe('Hello world')
    );
    test(
      'Other methods can access parent class method definition',
      () => expect(instance.getThisSuperName()).toBe('Hello')
    );

    const instance2 = new TestChild();
    instance2.postfix = '!';

    test(
      'Instances accessing superclass methods use correct context',
      () => expect(instance2.getThisName()).toBe('Hello! world')
    );

    const instance3 = new TestChild();
    test(
      'Instances accessing superclass methods use exact unbounded version from prototype',
      () => expect(instance3.getThisSuperNameMethod()).toBe(TestParent.prototype.getThisName)
    );
  });

  test('Decoration of illegal cass member throws error', () => {
    expect(() => {
      class Test {
        // @ts-ignore
        @bind public a = 1;
      }
    }).toThrow();
  });
});
