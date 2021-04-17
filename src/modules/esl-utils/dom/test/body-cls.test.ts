import {BodyClassManager} from '../body-cls';

describe('dom/styles tests', () => {

  const list = document.body.classList;
  const lock1 = document.createElement('div');
  const lock2 = document.createElement('div');

  test('test case', () => {
    BodyClassManager.toggleClsTo('a', lock1, true);
    expect(list.contains('a')).toBeTruthy();
    BodyClassManager.toggleClsTo('a',  lock2, true);
    expect(list.contains('a')).toBeTruthy();

    BodyClassManager.toggleClsTo('a',  lock1, false);
    expect(list.contains('a')).toBeTruthy();
    BodyClassManager.toggleClsTo('a',  lock2, false);
    expect(list.contains('a')).toBeFalsy();
  });
});
