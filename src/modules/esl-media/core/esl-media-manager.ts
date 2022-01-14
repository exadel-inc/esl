import type {ESLMedia} from './esl-media';

const managerMap = new Map<string, ESLMedia>();

/**
 * Group restriction manager for {@link ESLMedia}
 * Only one media in group can be played
 * Empty group is ignored
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
export class MediaGroupRestrictionManager {
  /** @internal */
  static get managerMap(): Map<string, ESLMedia> {
    return managerMap;
  }

  /** Register instance play state in group */
  public static registerPlay(instance: ESLMedia): void {
    if (instance.group) {
      const current = managerMap.get(instance.group);
      managerMap.set(instance.group, instance);
      if (!current || current === instance || !current.active) return;
      if (current.$$fire('mangedpause')) {
        current.pause();
      }
    }
  }

  /** Unregister instance */
  public static unregister(instance: ESLMedia): void {
    if (instance.group) {
      const reg = managerMap.get(instance.group);
      if (reg === instance) managerMap.delete(instance.group);
    }
  }
}
