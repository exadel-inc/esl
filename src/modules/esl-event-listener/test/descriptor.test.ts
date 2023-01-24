import {ESLEventUtils} from '../core';

describe('dom/events: ESLEventUtils: ESLListenerDescriptor Utils', () => {
  describe('ESLEventUtils.isEventDescriptor', () => {
    function fakeDesc() {}
    descEvent.event = false;

    function descEvent() {}
    descEvent.event = 'event';

    function descEventProvider() {}
    descEventProvider.event = () => 'event';

    test.each([
      [undefined, false],
      [null, false],
      ['', false],
      [{}, false],
      [{event: ''}, false],
      [function noop() {}, false],
      [fakeDesc, false],

      [descEvent, true],
      [descEventProvider, true]
    ])(
      'isEventDescriptor(%p) = %s',
      (sample: any, check: boolean) => expect(ESLEventUtils.isEventDescriptor(sample)).toBe(check)
    );
  });

  describe('ESLEventUtils.descriptors', () => {
    describe('ESLEventUtils.descriptors: negative case', () => {
      test.each([
        [undefined],
        [null],
        [''],
        [{}],
        [{event: ''}],
        [{onEvent() {}}],
        [new (class Test {onEvent() {}})()]
      ])('host = %p', (host) => expect(ESLEventUtils.descriptors(host)).toEqual([]));
    });
  });
});
