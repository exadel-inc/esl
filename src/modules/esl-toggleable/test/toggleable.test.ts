import {ESLToggleable} from '../core';

describe('ESLToggleable custom element - basic tests', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
  });

  afterAll(() => jest.clearAllMocks());

  describe('Default behavior', () => {
    const $el = ESLToggleable.create();

    beforeAll(() => document.body.appendChild($el));

    test('ESLToggleable instance', () => expect($el).toBeInstanceOf(ESLToggleable));

    describe('Connected callback', () => {
      test('shouldn`t be open initially', () => {
        expect($el.initiallyOpened).toBe(false);
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(false);
      });

      test('should generate id', () => {
        expect($el.noAutoId).toBe(false);
        expect($el.id).toBeTruthy();
      });
    });

    describe('Attribute change callback', () => {
      test('should toggle on `open` attribute change', () => {
        $el.setAttribute('open', '');
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(true);
      });

      test('should dispatch group change event on group attribute change', () => {
        jest.spyOn($el, 'dispatchEvent');

        const groupName = 'test-a';
        $el.setAttribute('group', groupName);
        expect($el.dispatchEvent).lastCalledWith(expect.objectContaining({type: ESLToggleable.prototype.GROUP_CHANGED_EVENT}));
      });
    });

    test('manual toggle actions', ()=> {
      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);

      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);

      $el.toggle();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);
    });
  });

  describe('Custom behavior', () => {
    describe('Connected callback', () => {
      const $el = ESLToggleable.create();
      $el.noAutoId = true;
      $el.setAttribute('open', '');

      beforeAll(() => document.body.appendChild($el));

      test('should open on connected callback', () => {
        expect($el.initiallyOpened).toBe(true);
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(true);
      });

      test('shouldn`t add id if it`s creation explicitly blocked', () => expect($el.id).toBe(''));
    });

    describe('ESLToggleables show/hide delay', () => {
      test('initial params', () => {
        const $el = ESLToggleable.create();
        $el.setAttribute('open', '');
        $el.initialParams = {delay: 90};
        document.body.appendChild($el);


        jest.advanceTimersByTime(1);
        expect($el.open).toBe(false);
        jest.advanceTimersByTime(89);
        expect($el.open).toBe(true);

        $el.hide();
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(false);
      });

      test('default params', () => {
        const $el = ESLToggleable.create();
        $el.setAttribute('open', '');
        $el.defaultParams = {delay: 90};
        document.body.appendChild($el);

        jest.advanceTimersByTime(1);
        expect($el.open).toBe(false);

        jest.advanceTimersByTime(90);
        expect($el.open).toBe(true);

        $el.hide();
        jest.advanceTimersByTime(90);
        expect($el.open).toBe(false);
      });
    });
  });
});
