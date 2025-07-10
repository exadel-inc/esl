import {ESLMedia} from '../core/esl-media';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';
import {promisifyTimeout} from '../../esl-utils/async/promise';
import {BaseProviderMock} from './mocks/base-provider.mock';

describe('ESLMedia: BaseProvider lifecycle', () => {
  jest.spyOn(console, 'debug').mockImplementation(() => {});

  ESLMedia.register();
  BaseProviderMock.register();

  let instance: ESLMedia;
  beforeAll(() => {
    instance = new ESLMedia();
    instance.mediaSrc = 'mock';
    instance.mediaType = 'mock';
    IntersectionObserverMock.mock();
  });

  afterAll(() => {
    IntersectionObserverMock.unmock();
  });

  test('Initial state is UNINITIALIZED', () => {
    expect(instance.state).toBe(ESLMedia.PLAYER_STATES.UNINITIALIZED);
  });

  describe('ESLMedia: initialized', () => {
    beforeAll(async () => {
      document.body.appendChild(instance);
      await promisifyTimeout(10);
    });

    test('After bind state is UNSTARTED', async () => {
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.UNSTARTED);
    });

    test('After play state is PLAYING', async () => {
      instance.play();
      await promisifyTimeout(10);
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.PLAYING);
    });

    test('After pause state is PAUSED', async () => {
      instance.pause();
      await promisifyTimeout(10);
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.PAUSED);
    });

    test('After resume state is PLAYING', async () => {
      instance.play();
      await promisifyTimeout(10);
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.PLAYING);
    });

    test('After stop state is ENDED', async () => {
      instance.stop();
      await promisifyTimeout(10);
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.ENDED);
    });

    test('Banch of play/pause commands stacked to the last one', async () => {
      const playSpy = jest.spyOn(BaseProviderMock.prototype as any, 'play');
      instance.play();
      instance.pause();
      instance.play();
      await promisifyTimeout(10);
      expect(instance.state).toBe(ESLMedia.PLAYER_STATES.PLAYING);
      expect(playSpy).toHaveBeenCalledTimes(1);
    });
  });
});
