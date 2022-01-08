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
    test('Getter call', () => {
      const newInstance = new TestClass();
      expect((console.log as jest.Mock).mock.calls).toEqual([
        ['\n[TestClass][constructor] Execution time: 0ms'],
        ['arguments:', []],
      ]);
    });
  });

  describe('Accessor log', () => {
    test('Getter call', () => {
      instance.testClassAccesor;
      expect((console.log as jest.Mock).mock.calls).toEqual([
        ['\n[TestClass][Acessor][get][testClassAccesor] Execution time: 0ms'],
        ['arguments:', []],
        ['returns:', 'getter return']
      ]);
    });

    test('Setter call', () => {
      instance.testClassAccesor = 'setter argument string';
      expect((console.log as jest.Mock).mock.calls).toEqual([
        ['\n[TestClass][Acessor][set][testClassAccesor] Execution time: 0ms'],
        ['arguments:', ['setter argument string']]
      ]);
    });
  });

  describe('Function log', () => {
    test('Function call with return value', () => {
      instance.testClassReturnFunction();
      expect((console.log as jest.Mock).mock.calls).toEqual([
        ['\n[TestClass][Method][testClassReturnFunction] Execution time: 0ms'],
        ['arguments:', []],
        ['returns:', 'function return']
      ]);
    });

    test('Function call', () => {
      instance.testClassFunction('function argument');
      expect((console.log as jest.Mock).mock.calls).toEqual([
        ['\n[TestClass][Method][testClassFunction] Execution time: 0ms'],
        ['arguments:', ['function argument']],
      ]);
    });
  });
});
