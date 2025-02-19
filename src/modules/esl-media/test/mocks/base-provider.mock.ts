import {BaseProvider, PlayerStates} from '../../core/esl-media-provider';

export class BaseProviderMock extends BaseProvider {
  public static override readonly providerName: string = 'mock';

  private _state = PlayerStates.UNINITIALIZED;

  public bind(): void {
    this._state = PlayerStates.UNSTARTED;
    this._ready = Promise.resolve();
  }

  public override unbind(): void {
    this._state = PlayerStates.UNINITIALIZED;
    this._ready = null as any;
  }

  public get duration(): number {
    return 100;
  }

  public get currentTime(): number {
    return 0;
  }

  public get defaultAspectRatio(): number {
    return 0;
  }

  protected pause(): void | Promise<any> {
    this._state = PlayerStates.PAUSED;
  }

  protected play(): void | Promise<any> {
    this._state = PlayerStates.PLAYING;
  }

  protected stop(): void | Promise<any> {
    this._state = PlayerStates.ENDED;
  }

  protected seekTo(pos?: number): void | Promise<any> {}

  public get state(): PlayerStates {
    return this._state;
  }
}
