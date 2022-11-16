import type {ShareConfig} from './esl-share-config';

export type ProviderOptions = Record<string, any>;
export type ProviderType = (new(options?: ProviderOptions) => ESLShareBaseConfigProvider) & typeof ESLShareBaseConfigProvider;

export abstract class ESLShareBaseConfigProvider {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  public constructor(options?: ProviderOptions) {}
  public abstract get(): Promise<ShareConfig>;
}
