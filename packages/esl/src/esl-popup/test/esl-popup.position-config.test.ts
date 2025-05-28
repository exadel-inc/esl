import {ESLPopup, type ESLPopupActionParams} from '../core';
import {Rect} from '../../esl-utils/dom/rect';
import {createPopupMock, createDimensional} from './popup.mock';

describe('ESLPopup: position config merging logic', () => {
  let $popup: ESLPopup;

  ESLPopup.register();
  const $container = createDimensional(new Rect(0, 0, 1000, 1000));
  const $trigger = createDimensional(new Rect(330, 330, 330, 330));
  const $arrow = createDimensional(new Rect(20, 20, 30, 30));
  $arrow.className = 'esl-popup-arrow';

  const paramsRef: ESLPopupActionParams = {
    activator: $trigger,
    containerEl: $container
  };

  const configRef = {
    arrow: new Rect(20, 20, 30, 30),
    behavior: 'fit',
    element: new Rect(20, 20, 100, 100),
    hasInnerOrigin: false,
    inner: new Rect(312, 312, 366, 366),
    intersectionRatio: {},
    isRTL: false,
    offsetPlacement: 0,
    marginTether: 5,
    offsetTetherRatio: 0.5,
    outer: new Rect(15, 15, 970, 970),
    placement: 'top',
    trigger: new Rect(330, 330, 330, 330)
  };

  beforeEach(() => {
    $popup = createPopupMock(new Rect(20, 20, 100, 100));
    $popup.appendChild($arrow);
  });

  test('should return the correct positionConfig with default params', () => {
    $popup.show(paramsRef);
    expect(($popup as any).positionConfig).toEqual(configRef);
  });

  test('should return the correct positionConfig for the specified position', () => {
    $popup.show({...paramsRef, position: 'bottom'});
    expect(($popup as any).positionConfig).toEqual({...configRef, placement: 'bottom'});
  });

  test('should return the correct positionConfig for the inner position origin', () => {
    $popup.show({...paramsRef, positionOrigin: 'inner'});
    expect(($popup as any).positionConfig).toEqual({
      ...configRef,
      hasInnerOrigin: true,
      inner: new Rect(348, 348, 294, 294)
    });
  });

  test('should return the correct positionConfig for the outer position origin', () => {
    $popup.show({...paramsRef, positionOrigin: 'outer'});
    expect(($popup as any).positionConfig).toEqual(configRef);
  });

  test('should return the correct positionConfig for the specified behavior', () => {
    $popup.show({...paramsRef, behavior: 'fit-minor'});
    expect(($popup as any).positionConfig).toEqual({...configRef, behavior: 'fit-minor'});
  });

  test('should return the correct positionConfig for the specified marginTether', () => {
    $popup.show({...paramsRef, marginTether: 15});
    expect(($popup as any).positionConfig).toEqual({...configRef, marginTether: 15});
  });

  test('should return the correct positionConfig for the specified tether alignment', () => {
    $popup.show({...paramsRef, alignmentTether: 'end'});
    expect(($popup as any).positionConfig).toEqual({...configRef, offsetTetherRatio: 1});
  });

  test('should return the correct positionConfig for the specified offsetTrigger', () => {
    $popup.show({...paramsRef, offsetTrigger: 13});
    expect(($popup as any).positionConfig).toEqual({...configRef, inner: new Rect(302, 302, 386, 386)});
  });

  test('should return the correct positionConfig for the specified offsetPlacement', () => {
    $popup.show({...paramsRef, offsetPlacement: 15});
    expect(($popup as any).positionConfig).toEqual({...configRef, offsetPlacement: 15});
  });

  test('should return the correct positionConfig for the specified offsetContainer', () => {
    $popup.show({...paramsRef, offsetContainer: [25, 5]});
    expect(($popup as any).positionConfig).toEqual({...configRef, outer: new Rect(25, 5, 950, 990)});
  });

  test('should return the correct positionConfig with default params and disabled arrow', () => {
    const $disabledArrow = createDimensional(new Rect(0, 0, 0, 0));
    $disabledArrow.className = 'esl-popup-arrow';
    $popup.replaceChildren($disabledArrow);
    $popup.show(paramsRef);
    expect(($popup as any).positionConfig).toEqual({
      ...configRef,
      arrow: new Rect(0, 0, 0, 0),
      inner: new Rect(327, 327, 336, 336)
    });
  });

  test('should return the correct positionConfig for the popup with RTL direction', () => {
    const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
    getComputedStyleSpy.mockImplementation(() => ({direction: 'rtl'} as CSSStyleDeclaration));
    $popup.show(paramsRef);
    expect(($popup as any).positionConfig).toEqual({...configRef, isRTL: true});
    getComputedStyleSpy.mockRestore();
  });
});
