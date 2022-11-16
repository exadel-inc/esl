import type {ShareButtonConfig} from './esl-share-button';
import type {ESLShareBaseConfigProvider, ProviderOptions, ProviderType} from './esl-share-config-provider';

export interface ShareGroupConfig {
  id: string;
  list: string;
}

export interface ShareConfig {
  buttons: ShareButtonConfig[];
  groups: ShareGroupConfig[];
}

export class ESLShareConfig {
  protected static provider: ESLShareBaseConfigProvider;

  public static use(provider: ProviderType, options?: ProviderOptions): ESLShareConfig {
    return ESLShareConfig.provider = new provider(options);
  }

  public static get(): Promise<ShareConfig> {
    return ESLShareConfig.provider.get();
  }
}
