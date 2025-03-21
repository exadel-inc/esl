import type {ESLMedia} from './esl-media';

export interface ESLMediaHookEventInit {
  initiator: 'initial' | 'user' | 'system';
  relatedMedia?: ESLMedia;
}

/**
 * Event class for {@link ESLMedia} hooks
 * (cancelable events dispatched during ESLMedia lifecycle)
 */
export class ESLMediaHookEvent extends Event implements ESLMediaHookEventInit {
  public override readonly target: ESLMedia;

  public readonly initiator: 'initial' | 'user' | 'system';
  public readonly relatedMedia?: ESLMedia;

  constructor(type: string, init: ESLMediaHookEventInit) {
    super(type, {
      bubbles: true,
      cancelable: true,
      composed: true
    });
    Object.assign(this, init);
  }
}
