import {BaseProvider, PlayerStates} from '../core/esl-media-provider';
import {randUID} from '../../esl-utils/misc/uid';

/**
 * Simple Basic Iframe provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
@BaseProvider.register
export class IframeBasicProvider extends BaseProvider {
  static readonly providerName: string = 'iframe';

  private _state: PlayerStates = PlayerStates.UNINITIALIZED;
  protected _el: HTMLIFrameElement;

  static parseUrl(url: string) {
    try {
      if (!url) return null;
      const {protocol} = new URL(url);
      if (protocol !== 'http:' && protocol !== 'https:') return null;
      return {mediaSrc: url};
    } catch {
      return null;
    }
  }

  protected buildIframe() {
    const el = document.createElement('iframe');
    el.id = 'esl-media-iframe-' + randUID();
    el.className = 'esl-media-inner esl-media-iframe';
    el.title = this.config.title;
    el.setAttribute('aria-label', this.config.title);
    el.setAttribute('frameborder', '0');
    el.setAttribute('tabindex', '0');
    el.setAttribute('scrolling', 'no');
    el.setAttribute('allowfullscreen', 'yes');
    el.toggleAttribute('playsinline', this.config.playsinline);
    el.src = this.config.mediaSrc || '';
    return el;
  }

  public bind() {
    if (this._state !== PlayerStates.UNINITIALIZED) return;
    this._ready = new Promise((resolve, reject) => {
      this._el = this.buildIframe();
      this._el.onload = () => resolve(this);
      this._el.onerror = (e) => reject(e);
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

  public unbind() {
    this.component._onDetach();
    this._state = PlayerStates.UNINITIALIZED;
    super.unbind();
  }

  get ready() {
    return Promise.resolve();
  }

  public focus() {
    if (this._el && this._el.contentWindow) {
      this._el.contentWindow.focus();
    }
  }

  public get state() {
    return this._state;
  }

  public get duration() {
    return 0;
  }

  public get currentTime() {
    return 0;
  }

  get defaultAspectRatio(): number {
    return 0;
  }

  public seekTo(pos: number) {
    console.error('[ESLMedia] Unsupported action: can not execute seekTo on abstract iframe provider');
  }

  public play() {
    if (this.state === PlayerStates.UNINITIALIZED) {
      this.bind();
    }
  }

  public pause() {
    this.unbind();
  }

  public stop() {
    this.unbind();
  }
}
