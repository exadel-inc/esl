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
  getViewportRect: () => Rect.from({x: 0, y: 0, width: 2000, height: 2000})
}));

const mockClientRects = (el: HTMLElement) => jest.spyOn(el, 'getClientRects').mockReturnValue([{}] as any);
const mockBoundingRect = (el: HTMLElement, rect: Rect) => jest.spyOn(el, 'getBoundingClientRect').mockReturnValueOnce(rect as any);

describe('Function isVisible', () => {
  test('display set to `none`', () => {
    expect(isVisible(btn)).toBe(false);
  });

  test('empty options object', () => {
    expect(isVisible(btn, {})).toBe(false);
    mockClientRects(btn);
    expect(isVisible(btn, {})).toBe(true);
  });

  test('default dimensions check', () => {
    mockClientRects(btn);
    expect(isVisible(btn)).toBe(true);
  });

  describe('Visibility css property', () => {
    test('visibility = hidden property on target', () => {
      expect(isVisible(btn)).toBe(true);
      btn.style.visibility = 'hidden';
      expect(isVisible(btn)).toBe(false);
      btn.style.visibility = 'visible';
    });

    test('visibility = hidden inherited from body', () => {
      document.body.style.visibility = 'hidden';
      expect(isVisible(div)).toBe(false);
    });

    test('visibility = hidden isn`t accounted for parent nodes', () => {
      div.style.visibility = 'hidden';
      expect(isVisible(btn)).toBe(true);
      div.style.visibility = 'visible';
    });

    test('visibility = hidden on Shadow DOM host', () => {
      const shadow = div.attachShadow({mode: 'open'});
      const shadowDiv = document.createElement('div');
      mockClientRects(shadowDiv);
      shadow.appendChild(shadowDiv);
      expect(isVisible(shadowDiv)).toBe(true);
      div.style.visibility = 'hidden';
      expect(isVisible(shadowDiv)).toBe(false);
    });
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

  describe('additional check for visibility in viewport', () => {
    test('element is out of window`s bounds', () => {
      mockBoundingRect(div, new Rect(-10, -200, 400, 300));
      mockBoundingRect(btn, new Rect(-10, -20, 10, 10));
      expect(isVisible(btn, {viewport: true})).toBe(false);
    });

    test('element is out of parent`s bounds', () => {
      mockBoundingRect(div, new Rect(0, 0, 100, 100));
      mockBoundingRect(btn, new Rect(0, 100, 10, 10));
      expect(isVisible(btn, {viewport: true})).toBe(false);
    });

    test('element is in parent`s and window`s bounds', () => {
      mockBoundingRect(div, new Rect(-10, -200, 200, 300,));
      mockBoundingRect(btn, new Rect(0, 0, 10, 10));
      expect(isVisible(btn, {viewport: true})).toBe(true);
    });

    test('element dimensions are 0', () => {
      mockBoundingRect(div, new Rect(-10, -200, 200, 300));
      mockBoundingRect(btn, new Rect(0, 0, 0, 0));
      expect(isVisible(btn, {viewport: true})).toBe(false);
    });
  });
});
