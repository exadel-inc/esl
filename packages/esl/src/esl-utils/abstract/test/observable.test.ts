import {Observable} from '../observable';

class TestObservable extends Observable {
  public override fire(test: number = -1) {
    super.fire(test);
  }
}

describe('abstract/observable test', () => {
  test('basic test', () => {
    const log: number[] = [];
    const test$$ = new TestObservable();
    const listener = (el: any) => log.push(el);

    test$$.addListener(listener);
    test$$.fire();
    expect(log.length).toBe(1);
    test$$.fire(1);
    expect(log.length).toBe(2);
    expect(log[log.length - 1]).toBe(1);
    test$$.addListener(listener);
    test$$.fire();
    expect(log.length).toBe(3);
    test$$.removeListener(listener);
    test$$.fire();
    expect(log.length).toBe(3);
  });

  test('safe check', () => {
    let logError = false;
    jest.spyOn(console, 'error').mockImplementation(() => { logError = true; });

    let logListener = false;
    const listener = () => { logListener = true; };
    const errorListener = () => {
      throw new Error('problem');
    };

    const test$$ = new TestObservable();

    test$$.addListener(listener);
    test$$.addListener(errorListener);

    expect(logListener).toBe(false);
    expect(logError).toBe(false);
    test$$.fire();
    expect(logListener).toBe(true);
    expect(logError).toBe(true);
  });
});
