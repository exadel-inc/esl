import '../../../polyfills/es5-target-shim';
import {ESLMedia} from '../core/esl-media';
import {ESLMediaRestrictionManager} from '../core/esl-media-manager';

describe('ESLMedia: MediaGroupRestrictionManager tests', () => {
  ESLMedia.register();

  test('_onPlay / _onPause', () => {
    const instance = new ESLMedia();
    instance.group = 'test';
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance);
    expect(ESLMediaRestrictionManager.instance.active.size).toBeGreaterThan(0);
    ESLMediaRestrictionManager.instance._onDeleteInactiveMedia(instance);
    expect(ESLMediaRestrictionManager.instance.active.size).toBe(0);
  });

  test('_onPlay manged pause: same group', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    instance1.group = instance2.group = 'test';
    Object.defineProperty(instance1, 'active', {value: true});
    const pauseSpy = jest.spyOn(instance1, 'pause');
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance1);
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance1);
    expect(pauseSpy).not.toBeCalled();
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance2);
    expect(pauseSpy).toBeCalled();
  });

  test('_onPlay manged pause: different groups', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    instance1.group = 'test1';
    instance2.group = 'test2';
    const pauseSpy = jest.spyOn(instance1, 'pause');
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance1);
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance1);
    expect(pauseSpy).not.toBeCalled();
    ESLMediaRestrictionManager.instance._onAddActiveMedia(instance2);
    expect(pauseSpy).not.toBeCalled();
  });
});
