import type {ShareButtonConfig} from './esl-share-button';

export interface ShareGroupConfig {
  id: string;
  list: string;
}

export interface ShareConfig {
  buttons: ShareButtonConfig[];
  groups: ShareGroupConfig[];
}

export class ESLShareConfig {
  protected static provider: () => Promise<ShareConfig>;

  public static use(provider: () => Promise<ShareConfig>): ESLShareConfig {
    return ESLShareConfig.provider = provider;
  }

  public static get(): Promise<ShareConfig> {
    return ESLShareConfig.provider();
  }
}
