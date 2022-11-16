import {ESLShareBaseConfigProvider} from '../core/esl-share-config-provider';

import type {ShareConfig} from '../core/esl-share-config';

export interface FetchConfigProviderOptions {
  url: string;
}

export class ESLShareFetchConfigProvider extends ESLShareBaseConfigProvider {
  protected url: string;

  public constructor(options: FetchConfigProviderOptions) {
    super();
    this.url = options.url;
  }

  public get(): Promise<ShareConfig> {
    return fetch(this.url).then((response) => response.json());
  }
}
