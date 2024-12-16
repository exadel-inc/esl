import {BaseProvider, PlayerStates} from '../core/esl-media-provider';
import {randUID} from '../../esl-utils/misc/uid';

import type {MediaProviderConfig} from '../core/esl-media-provider';

/**
 * Simple Basic Iframe provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
@BaseProvider.register
export class IframeBasicProvider extends BaseProvider {
  static override readonly providerName: string = 'iframe';

  private _state: PlayerStates = PlayerStates.UNINITIALIZED;
  protected override _el: HTMLIFrameElement;

  static override parseUrl(url: string): Partial<MediaProviderConfig> | null {
    try {
      if (!url) return null;
      const {protocol} = new URL(url);
      if (protocol !== 'http:' && protocol !== 'https:') return null;
      return {mediaSrc: url};
    } catch {
      return null;
    }
  }

  protected buildIframe(): HTMLIFrameElement {
    const el = document.createElement('iframe');
    el.id = 'esl-media-iframe-' + randUID();
    el.className = 'esl-media-inner esl-media-iframe';
    el.title = this.config.title;
    el.setAttribute('aria-label', this.config.title);
    el.setAttribute('frameborder', '0');
    el.setAttribute('tabindex', this.config.isFocusable ? '0' : '-1');
    el.setAttribute('scrolling', 'no');
    el.setAttribute('allowfullscreen', 'yes');
    el.toggleAttribute('playsinline', this.config.playsinline);
    el.src = this.config.mediaSrc || '';
    return el;
  }

  public bind(): void {
    if (this._state !== PlayerStates.UNINITIALIZED) return;
    this._ready = new Promise((resolve, reject) => {
      this._el = this.buildIframe();
      this._el.onload = (): void => resolve(this);
      this._el.onerror = (e): void => reject(e);
      this._state = PlayerStates.UNSTARTED;
      this.component.appendChild(this._el);
    });
    this._ready.then(() => {
      this._state = PlayerStates.PLAYING;
      this.component._onReady();
      this.component._onPlay();
    });
    this._ready.catch((e) => this.component._onError(e));
  }

  public override unbind(): void {
    this.component._onDetach();
    this._state = PlayerStates.UNINITIALIZED;
    super.unbind();
  }

  override get ready(): Promise<any> {
    return Promise.resolve();
  }

  public override focus(): void {
    if (this._el && this._el.contentWindow) {
      this._el.contentWindow.focus();
    }
  }

  public get state(): PlayerStates {
    return this._state;
  }

  public get duration(): number {
    return 0;
  }

  public get currentTime(): number {
    return 0;
  }

  get defaultAspectRatio(): number {
    return 0;
  }

  public seekTo(pos: number): void {
    console.error('[ESLMedia] Unsupported action: can not execute seekTo on abstract iframe provider');
  }

  public play(): void {
    if (this.state === PlayerStates.UNINITIALIZED) {
      this.bind();
    }
  }

  public pause(): void {
    this.unbind();
  }

  public stop(): void {
    this.unbind();
  }
}
