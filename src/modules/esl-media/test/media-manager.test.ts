import '../../../polyfills/es5-target-shim';
import ESLMedia from '../core/esl-media';
import MediaGroupRestrictionManager from '../core/esl-media-manager';

describe('ESLMedia: MediaGroupRestrictionManager tests', () => {
  ESLMedia.register();

  test('registerPlay / unregister', () => {
    const instance = new ESLMedia();
    instance.group = 'test';
    MediaGroupRestrictionManager.registerPlay(instance);
    expect(MediaGroupRestrictionManager.managerMap.size).toBeGreaterThan(0);
    MediaGroupRestrictionManager.unregister(instance);
    expect(MediaGroupRestrictionManager.managerMap.size).toBe(0);
  });

  test('registerPlay manged pause: same group', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    instance1.group = instance2.group = 'test';
    Object.defineProperty(instance1, 'active', { value: true });
    const pauseSpy = jest.spyOn(instance1, 'pause');
    MediaGroupRestrictionManager.registerPlay(instance1);
    MediaGroupRestrictionManager.registerPlay(instance1);
    expect(pauseSpy).not.toBeCalled();
    MediaGroupRestrictionManager.registerPlay(instance2);
    expect(pauseSpy).toBeCalled();
  });

  test('registerPlay manged pause: different groups', () => {
    const instance1 = new ESLMedia();
    const instance2 = new ESLMedia();
    instance1.group = 'test1';
    instance2.group = 'test2';
    const pauseSpy = jest.spyOn(instance1, 'pause');
    MediaGroupRestrictionManager.registerPlay(instance1);
    MediaGroupRestrictionManager.registerPlay(instance1);
    expect(pauseSpy).not.toBeCalled();
    MediaGroupRestrictionManager.registerPlay(instance2);
    expect(pauseSpy).not.toBeCalled();
  });
});

