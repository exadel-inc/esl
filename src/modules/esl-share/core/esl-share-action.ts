import type {ESLShareButton} from './esl-share-button';

export type ActionType = (new($button: ESLShareButton) => ESLShareBaseAction) & typeof ESLShareBaseAction;

export abstract class ESLShareBaseAction {
  static readonly is: string;

  public constructor(protected $button: ESLShareButton) {}

  public abstract do(): void;
}
