import {BaseProvider, PlayerStates} from '../core/esl-media-provider';

export class BaseProviderMock extends BaseProvider {
  public bind(): void {}

  public get duration(): number {
    return 0;
  }

  public get currentTime(): number {
    return 0;
  }

  public get defaultAspectRatio(): number {
    return 0;
  }

  protected pause(): void | Promise<any> {}

  protected play(): void | Promise<any> {}

  protected stop(): void | Promise<any> {}

  protected seekTo(pos?: number): void | Promise<any> {}

  public get state() {
    return PlayerStates.UNINITIALIZED;
  }
}
