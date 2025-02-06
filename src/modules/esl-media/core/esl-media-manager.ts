import type {ESLMedia} from './esl-media';

/**
 * Restriction manager for {@link ESLMedia}
 * Defines media that can play from active list
 * Only one media from group can be played
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
export class ESLMediaRestrictionManager {
  public static active: Set<ESLMedia> = new Set();

  /** Add player to list */
  public static _onPlay(instance: ESLMedia): void {
    this.active.add(instance);
    this.active.forEach((player: ESLMedia) => {
      if (!player.active || player === instance) return;
      if (player.group !== instance.group) return;
      if (player.$$fire(player.MANAGED_PAUSE_EVENT)) player.pause();
    });
  }

  /** Remove player from list */
  public static _onPause(instance: ESLMedia): void {
    this.active.delete(instance);
  }
}
