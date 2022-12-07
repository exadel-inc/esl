import {isVisible} from '../visible';
import {Rect} from '../rect';

document.body.innerHTML = `
  <div id="row1" class="row">
    <button id="btn1"></button>
  </div>
`;

const div = document.querySelector('#row1') as HTMLDivElement;
const btn = document.querySelector('#btn1') as HTMLButtonElement;

jest.mock('../scroll', () => ({
  getListScrollParents: () => [div]
}));

jest.mock('../window', () => ({
  getWindowRect: () => Rect.from({x: 0, y: 0, width: 2000, height: 2000})
}));

describe('Function isVisible', () => {
  test('display set to `none`', () => {
    expect(isVisible(btn)).toBe(false);
  });

  test('default dimensions check', () => {
    jest.spyOn(btn, 'getClientRects').mockReturnValue([{}] as any);
    expect(isVisible(btn)).toBe(true);
  });

  test('default check for css visibility property', () => {
    expect(isVisible(btn)).toBe(true);
    div.style.visibility = 'hidden';
    expect(isVisible(btn)).toBe(false);
    div.style.visibility = 'initial';
  });

  test('check without css visibility property', () => {
    expect(isVisible(btn, {visibility: false})).toBe(true);
    div.style.visibility = 'hidden';
    expect(isVisible(btn, {visibility: false})).toBe(true);
    div.style.visibility = 'initial';
  });

  test('additional check for css opacity property', () => {
    div.style.visibility = 'initial';
    div.style.opacity = '0';
    expect(isVisible(btn)).toBe(true);
    expect(isVisible(btn, {opacity : true})).toBe(false);
  });

  test('failed additional check for viewport visibility', () => {
    const boundingClientRect1 = Rect.from({top: -20, left: -10, height: 10, width: 10}) as any;
    const boundingClientRect2 = Rect.from({top: -200, left: -10, height: 300, width: 400}) as any;
    jest.spyOn(btn, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect1);
    jest.spyOn(div, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect2);
    expect(isVisible(btn, {viewport: true})).toBe(false);
  });

  test('passed additional check for viewport visibility', () => {
    const boundingClientRect1 = Rect.from({top: 0, left: 0, height: 10, width: 20}) as any;
    const boundingClientRect2 = Rect.from({top: -200, left: -10, height: 300, width: 200}) as any;
    jest.spyOn(btn, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect1);
    jest.spyOn(div, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect2);
    expect(isVisible(btn, {viewport: true})).toBe(true);
  });

  test('additional check for viewport visibility with element dimensions set to 0', () => {
    const boundingClientRect1 = Rect.from({top: 0, left: 0, height: 0, width: 0}) as any;
    const boundingClientRect2 = Rect.from({top: -200, left: -10, height: 300, width: 200}) as any;
    jest.spyOn(btn, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect1);
    jest.spyOn(div, 'getBoundingClientRect').mockReturnValueOnce(boundingClientRect2);
    expect(isVisible(btn, {viewport: true})).toBe(false);
  });
});
