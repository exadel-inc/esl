import {ESLPopup, type ESLPopupActionParams} from '../core';
import {IntersectionObserverMock} from '../../test/intersectionObserver.mock';

describe('ESLPopup: proxy logic of config', () => {
  let $popup: ESLPopup;

  ESLPopup.register();

  class TestPopup1 extends ESLPopup {
    static override is = 'test-popup-1';
    static override DEFAULT_PARAMS = {};
  }
  TestPopup1.register();

  class TestPopup2 extends ESLPopup {
    static override is = 'test-popup-2';
    static override DEFAULT_PARAMS: ESLPopupActionParams = {position: 'right'};
  }
  TestPopup2.register();

  const defaultAttrs: ESLPopupActionParams = {
    position: 'top',
    positionOrigin: 'outer',
    alignmentTether: '',
    behavior: 'fit',
    offsetPlacement: 0,
    marginTether: 5,
    offsetTrigger: 3,
    container: '',
    disableActivatorObservation: false
  };

  const defaultParams: ESLPopupActionParams = {
    intersectionMargin: '0px',
    offsetContainer: 15
  };

  beforeAll(() => {
    IntersectionObserverMock.mock();
    vi.useFakeTimers();
  });

  afterAll(() => {
    IntersectionObserverMock.restore();
    vi.useRealTimers();
  });

  beforeEach(() => {
    $popup = new ESLPopup();
  });
  afterEach(() => {
    $popup.hide();
  });

  test('should return default attributes if the showing parameters and default parameters are missing', () => {
    $popup = new TestPopup1();
    $popup.show({});
    expect({...$popup.config}).toEqual({...defaultAttrs});
  });

  test('should return merging default parameters and default attributes if the showing parameters are missing', () => {
    $popup.show({});
    expect({...$popup.config}).toEqual({...defaultAttrs, ...defaultParams});
  });

  test('should return merging showing parameters, default parameters, and default attributes', () => {
    const params: ESLPopupActionParams = {
      extraClass: 'test-class'
    };
    $popup.show(params);
    expect({...$popup.config}).toEqual({...defaultAttrs, ...defaultParams, ...params});
  });

  test('should have value from default params in the case also prop defined via attributes', () => {
    $popup = new TestPopup2();
    $popup.show({});
    expect($popup.config.position).toBe('right');
  });

  test('should have value from the passed onShow() params in the case also prop defined both via default and attributes', () => {
    $popup = new TestPopup2();
    $popup.show({position: 'left'});
    expect($popup.config.position).toBe('left');
  });

  test('should prohibit the ability to change configuration properties', () => {
    const setProperty = () => {
      $popup.config.container = 'test-value';
    };
    expect(setProperty).toThrow('\'set\' on proxy: trap returned falsish for property \'container\'');
  });

  test('should prohibit the ability to add new configuration properties', () => {
    const setProperty = () => {
      $popup.config.foo = 'bar';
    };
    expect(setProperty).toThrow('\'set\' on proxy: trap returned falsish for property \'foo\'');
  });

  test('should have enumerable properties', () => {
    $popup.show({});
    const entries = Object.entries($popup.config);
    expect(entries).toEqual(expect.arrayContaining([
      ...Object.entries(defaultParams),
      ...Object.entries(defaultAttrs)
    ]));
  });

  test('should return default attributes after popup hiding', () => {
    const params: ESLPopupActionParams = {
      extraClass: 'test-class'
    };
    $popup.show(params);
    $popup.hide();
    expect({...$popup.config}).toEqual({...defaultAttrs});
  });

  test('should be updated after each onShow() call', () => {
    const params1: ESLPopupActionParams = {
      extraClass: 'test-class'
    };
    const params2: ESLPopupActionParams = {
      extraStyle: 'color: red'
    };
    $popup.show(params1);
    expect({...$popup.config}).toEqual({...defaultAttrs, ...defaultParams, ...params1});
    $popup.hide();
    $popup.show(params2);
    expect({...$popup.config}).toEqual({...defaultAttrs, ...defaultParams, ...params2});
  });

  test('should be updated after attribure changing', () => {
    const params: ESLPopupActionParams = {
      extraClass: 'test-class'
    };
    $popup.show(params);
    expect({...$popup.config}).toEqual({...defaultAttrs, ...defaultParams, ...params});
    $popup.container = '::prev';
    expect({...$popup.config}).toEqual({...defaultAttrs, container: '::prev', ...defaultParams, ...params});
  });
});
