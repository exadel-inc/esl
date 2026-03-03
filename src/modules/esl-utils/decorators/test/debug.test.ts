import {debug} from '../debug';

describe('Decorator: @debug', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  @debug()
  class TestClass {

    get testClassAccesor() {
      return 'getter return';
    }

    set testClassAccesor(arg: any) {
    }

    testClassFunction(arg: any) {
    }

    testClassReturnFunction() {
      return 'function return';
    }
  }

  const instance = new TestClass();

  describe('Constructor log', () => {
    test('Validation check', () => {
      expect(function () {
        class Test {
          // @ts-ignore
          @debug() public test() {
            return 'a';
          }
        }
        new Test();
      }).toThrow(TypeError);
    });

    test('Getter call', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newInstance = new TestClass();
      expect((console.log as jest.Mock).mock.calls).toEqual([
        [expect.stringContaining('\n[TestClass][constructor] Execution time:')],
        ['arguments:', []],
      ]);
    });
  });

  describe('Accessor log', () => {
    test('Getter call', () => {
      instance.testClassAccesor;
      expect((console.log as jest.Mock).mock.calls).toEqual([
        [expect.stringContaining('\n[TestClass][Getter][testClassAccesor] Execution time:')],
        ['arguments:', []],
        ['returns:', 'getter return']
      ]);
    });

    test('Setter call', () => {
      instance.testClassAccesor = 'setter argument string';
      expect((console.log as jest.Mock).mock.calls).toEqual([
        [expect.stringContaining('\n[TestClass][Setter][testClassAccesor] Execution time:')],
        ['arguments:', ['setter argument string']]
      ]);
    });
  });

  describe('Function log', () => {
    test('Function call with return value', () => {
      instance.testClassReturnFunction();
      expect((console.log as jest.Mock).mock.calls).toEqual([
        [expect.stringContaining('\n[TestClass][Function][testClassReturnFunction] Execution time:')],
        ['arguments:', []],
        ['returns:', 'function return']
      ]);
    });

    test('Function call', () => {
      instance.testClassFunction('function argument');
      expect((console.log as jest.Mock).mock.calls).toEqual([
        [expect.stringContaining('\n[TestClass][Function][testClassFunction] Execution time:')],
        ['arguments:', ['function argument']],
      ]);
    });
  });
});
