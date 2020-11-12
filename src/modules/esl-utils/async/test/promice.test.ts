import {PromiseUtils} from '../promise';

describe('PromiseUtils tests', () => {
  test('fromTimeout', () =>
      PromiseUtils.fromTimeout(30, true)
        .then((v) => expect(v).toBe(true)),
    60
  );

  test('resolve', () => PromiseUtils.resolve(true).then((v) => expect(v).toBe(true)));
  test('reject', () => PromiseUtils.reject(true).catch((v) => expect(v).toBe(true)));

  test('fromEvent', () => {
    const el = document.createElement('div');
    setTimeout(() => el.dispatchEvent(new CustomEvent('test')), 20);
    return PromiseUtils.fromEvent(el, 'test').then((e) => expect(e.type).toBe('test'));
  });
  test('fromEvent: timeout', () => {
    const el = document.createElement('div');
    setTimeout(() => el.dispatchEvent(new CustomEvent('test')), 100);
    return PromiseUtils.fromEvent(el, 'test', 10).catch(() => expect(true).toBe(true));
  });

  test('tryUntil: successful', () => {
    let i = 0;

    setTimeout(() => i++, 50);
    setTimeout(() => i++, 150);

    return PromiseUtils.tryUntil(() => i > 1).then(() => expect(true).toBe(true));
  });
  test('tryUntil: failed', () => {
    return PromiseUtils.tryUntil(() => false)
      .catch(() => expect(true).toBe(true));
  });

  test('fromMarker', () => {
    const el = document.createElement('div');
    (el as any).test = true;
    return PromiseUtils.fromMarker(el, 'test').then((e) => expect(true).toBe(true));
  });
});
