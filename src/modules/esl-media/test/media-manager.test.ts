import '../../../polyfills/es5-target-shim';
import {ESLMedia} from '../core/esl-media';
import {ESLMediaManager} from '../core/esl-media-manager';

describe('ESLMedia: MediaGroupRestrictionManager tests', () => {
  ESLMedia.register();

  test('_onPlay / _onPause', () => {
    const instance = new ESLMedia();
    const manager = new ESLMediaManager();
    instance.group = 'test';
    manager._onAfterPlay(instance);
    expect(manager.active.size).toBeGreaterThan(0);
    manager._onAfterPause(instance);
    expect(manager.active.size).toBe(0);
  });

  test('_onPlay managed pause: same group', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    const manager = new ESLMediaManager();
    instance1.group = instance2.group = 'test';
    Object.defineProperty(instance1, 'active', {value: true});
    const pauseSpy = jest.spyOn(instance1, 'pause');
    manager._onAfterPlay(instance1);
    manager._onAfterPlay(instance1);
    expect(pauseSpy).not.toBeCalled();
    manager._onAfterPlay(instance2);
    expect(pauseSpy).toBeCalled();
  });

  test('_onPlay managed pause: different groups', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    const manager = new ESLMediaManager();
    instance1.group = 'test1';
    instance2.group = 'test2';
    const pauseSpy = jest.spyOn(instance1, 'pause');
    manager._onAfterPlay(instance1);
    manager._onAfterPlay(instance1);
    expect(pauseSpy).not.toBeCalled();
    manager._onAfterPlay(instance2);
    expect(pauseSpy).not.toBeCalled();
  });
});
