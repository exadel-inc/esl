import {BaseProvider, ProviderType} from '../core/esl-media-provider';
import {ESLMediaProviderRegistry} from '../core/esl-media-registry';
import {BaseProviderMock} from './base-provider.mock';

describe('ESLMedia: BaseProvider tests', () => {
  const {instance} = ESLMediaProviderRegistry;

  test('BaseProvider can\'t be registered', () => {
    expect(() => (BaseProvider as ProviderType).register()).toThrowError();
  });

  test('Not provider can\'t be registered', () => {
    expect(() => BaseProvider.register([] as any)).toThrowError();
  });

  test('Provider should have correct name', () => {
    expect(() => BaseProviderMock.register()).toThrowError();
  });

  test('Test provider registered', () => {
    class TestProvider extends BaseProviderMock {
      static readonly providerName = 'test-provider';
    }
    expect(instance.has('test-provider')).toBe(false);
    expect(instance.findByName('test-provider')).toBe(null);
    TestProvider.register();
    expect(instance.has('test-provider')).toBe(true);
    expect(instance.findByName('test-provider')).toBe(TestProvider);
  });

  test('Test provider registered via decorator', () => {
    @BaseProvider.register
    class TestProvider extends BaseProviderMock {
      static readonly providerName = 'test-provider-2';
    }
    expect(instance.has('test-provider-2')).toBe(true);
    expect(instance.findByName('test-provider-2')).toBe(TestProvider);
  });
});

