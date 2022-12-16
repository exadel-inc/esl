import type {ShareButtonConfig} from './esl-share-button';

export type ESLShareConfigProviderType = () => Promise<ShareConfig>;
export interface ShareGroupConfig {
  id: string;
  list: string;
}

export interface ShareConfig {
  buttons: ShareButtonConfig[];
  groups: ShareGroupConfig[];
}

export class ESLShareConfig {
  protected static provider: ESLShareConfigProviderType;

  public static use(provider: ESLShareConfigProviderType): ESLShareConfig {
    return ESLShareConfig.provider = provider;
  }

  public static get(): Promise<ShareConfig> {
    return ESLShareConfig.provider();
  }
}
