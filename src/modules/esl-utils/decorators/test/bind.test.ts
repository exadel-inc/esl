import {bind} from '../bind';

describe('common @bind decorator test', () => {
  test('basic binding test', () => {
    const test = new TestClass('1');
    const test2 = new TestClass('2');

    expect(test.getThis.call(null)).toBe(test);
    expect(test.getThis.call(null)).toBe(test);
    expect(test2.getThis.call(null)).toBe(test2);

    expect(test.getThis.call(null)).toBe(test);
    expect(test.getThis).toBe(test.getThis);

    expect(test.getThis).not.toBe(test2.getThis);
  });

  test('basic context test', () => {
    const test = new TestClass('1');
    const test2 = new TestClass('2');

    expect(test.getThisName.call(null)).toBe('1');
    expect(test2.getThisName.call(null)).toBe('2');
    const cb = test2.getThisName;
    expect(cb()).toBe('2');
  });

  test('inheritance basic binding test', () => {
    class TestChildClass extends TestClass {
    }

    const test = new TestChildClass('3');
    expect(test.getThis.call(null)).toBe(test);
    expect(test.getThis.call(null)).toBe(test);
    expect(test.getThis).toBe(test.getThis);
  });

  test('inheritance prototype binding test', () => {
    const test = new TestClass('1');
    const test2 = new TestClass('2');
    expect(TestClass.prototype.getThis.call(test)).toBe(test);
    expect(TestClass.prototype.getThis.call(test2)).toBe(test2);
  });

  test('inheritance override binding test', () => {
    const test = new TestClass('1');
    const test2 = new TestClass('2');
    expect(test.getThis.call(null)).toBe(test);
    test.getThis = () => test2;
    expect(test.getThis.call(null)).toBe(test2);
  });

  test('inheritance super binding test', () => {
    class TestChildClass extends TestClass {
      @bind
      getThisName() {
        return '!' + super.getThisName();
      }
      getThisSuperName() {
        return super.getThisName();
      }
    }

    const test = new TestChildClass('4');
    expect(test.getThisName()).toBe('!4');
    expect(test.getThisName.call(null)).toBe('!4');
    expect(test.getThisSuperName()).toBe('4');
  });

  test('validation check', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        // @ts-ignore
        @bind public a = 1;
      }
    }).toThrowError();
  });
});

class TestClass {
  constructor(public name: string) {
  }

  @bind
  getThis() {
    return this;
  }

  @bind
  getThisName(): any {
    return this.name;
  }
}
