import {ESLMedia} from '../core/esl-media';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';
import {promisifyTimeout} from '../../esl-utils/async/promise';
import {BaseProviderMock} from './mocks/base-provider.mock';

describe('[ESLMedia]: ESLMediaManager tests', () => {
  vi.spyOn(console, 'debug').mockImplementation(() => {});

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
        IntersectionObserverMock.mock();
      }
      await ESLMedia.registered;
    });
    afterAll(() => {
      IntersectionObserverMock.restore();
    });
    beforeEach(async () => {
      document.body.append(...instances);
      await promisifyTimeout(10);
    });
    afterEach(() => {
      instances.forEach((i) => i.remove());
    });

    // TODO: needs to be reworked after delayed task refactoring (which is the reason of incorrect await time)
    async function runPlayTestSequence(expectMatrix: boolean[][]): Promise<void> {
      expect(instances.length).toBe(expectMatrix.length); // Ensure test data is correct
      for (let i = 0; i < instances.length; i++) {
        await instances[i].play();
        // Wait for 2 microtasks + 2 tasks + 100ms of time
        await promisifyTimeout(50);
        await promisifyTimeout(50);
        expect(instances.map(isActive)).toEqual(expectMatrix[i]);
      }
    }

    test('ESLMediaManger: only one active instance allowed in the group', async () => {
      instances.forEach((i) => i.group = 'test');
      await runPlayTestSequence([
        [true, false, false],
        [false, true, false],
        [false, false, true]
      ]);
    });

    test('ESLMediaManger: instances of different groups can be active simultaneously', async () => {
      instances.forEach((i, idx) => i.group = `group${idx}`);
      await runPlayTestSequence([
        [true, false, false],
        [true, true, false],
        [true, true, true]
      ]);
    });

    test('ESLMediaManager: instances without group does not affect any other instance', async () => {
      instances[0].group = 'test';
      instances[1].group = '';
      instances[2].group = 'test';
      await runPlayTestSequence([
        [true, false, false],
        [true, true, false],
        [false, true, true]
      ]);
    });
  });
});
