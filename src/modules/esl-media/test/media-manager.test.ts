import {ESLMedia} from '../core/esl-media';
import {ESLMediaManager} from '../core/esl-media-manager';
import {promisifyTimeout} from '../../esl-utils/async/promise';
import {BaseProviderMock} from './mocks/base-provider.mock';

describe('[ESLMedia]: ESLMediaManager tests', () => {
  jest.spyOn(console, 'debug').mockImplementation(() => {});

  ESLMedia.register();
  BaseProviderMock.register();

  describe('ESLMediaManager: group behaviour', () => {
    const isActive = (i: ESLMedia) => i.active;
    const instances: ESLMedia[] = [];

    beforeAll(async () => {
      for (let i = 0; i < 3; i++) {
        const instance = new ESLMedia();
        instance.mediaSrc = 'mock';
        instance.mediaType = 'mock';
        instances.push(instance);
      }
      await ESLMedia.registered;
    });
    beforeEach(async () => {
      document.body.append(...instances);
      await promisifyTimeout(10);
    });
    afterEach(() => {
      instances.forEach((i) => i.remove());
    });

    test('ESLMediaManger: only one active instance allowed in the group', async () => {
      instances.forEach((i) => i.group = 'test');
      await instances[0].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, false, false]);
      await instances[1].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([false, true, false]);
      await instances[2].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([false, false, true]);
    });

    test('ESLMediaManger: instances of different groups can be active simultaneously', async () => {
      instances.forEach((i, idx) => i.group = `group${idx}`);
      await instances[0].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, false, false]);
      await instances[1].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, true, false]);
      await instances[2].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, true, true]);
    });

    test('ESLMediaManager: instnces without group does not affect any other instance', async () => {
      instances[0].group = 'test';
      instances[1].group = '';
      instances[2].group = 'test';
      await instances[0].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, false, false]);
      await instances[1].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([true, true, false]);
      await instances[2].play();
      await promisifyTimeout(50);
      expect(instances.map(isActive)).toEqual([false, true, true]);
    });
  });
});
