import {promisifyTransition} from '../../promise/animation';

describe('async/animation', () => {
  test('promisifyTransition catches the transition event',  async () => {
    const el = document.createElement('div');
    const $promise = promisifyTransition(el);
    el.dispatchEvent(new Event('transitionend'));
    return $promise;
  });

  test('promisifyTransition catches the transition event',  async () => {
    const el = document.createElement('div');
    let resolved: boolean | undefined;
    promisifyTransition(el, 'height').then(() => resolved = true, () => resolved = false);
    el.dispatchEvent(Object.assign(new Event('transitionend'), {propertyName: 'width'}));
    await Promise.resolve();
    expect(resolved).toBe(undefined);
    el.dispatchEvent(Object.assign(new Event('transitionend'), {propertyName: 'height'}));
    await Promise.resolve();
    expect(resolved).toBe(true);
  });
});
