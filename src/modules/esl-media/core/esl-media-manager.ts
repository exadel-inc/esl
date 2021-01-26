/**
 * Group restriction manager for {@link ESLMedia}
 * Only one media in group can be played
 * Empty group is ignored
 * @version 1.0.0-alpha
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
import ESLMedia from './esl-media';

const managerMap = new Map<string, ESLMedia>();

export class MediaGroupRestrictionManager {
  /**
   * @debug info
   */
  static get managerMap() {
    return managerMap;
  }

  /**
   * Register instance play state in group
   */
  public static registerPlay(instance: ESLMedia) {
    if (instance.group) {
      const current = managerMap.get(instance.group);
      managerMap.set(instance.group, instance);
      if (!current || current === instance || !current.active) return;
      if (current.$$fire('mangedpause')) {
        current.pause();
      }
    }
  }

  /**
   * Unregister instance
   */
  public static unregister(instance: ESLMedia) {
    if (instance.group) {
      const reg = managerMap.get(instance.group);
      if (reg === instance) managerMap.delete(instance.group);
    }
  }
}

export default MediaGroupRestrictionManager;
