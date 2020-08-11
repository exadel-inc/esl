/**
 * Group restriction manager for {@link ESLMedia}
 * Only one media in group can be played
 * Empty group is ignored
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
import ESLMedia from './esl-media';

interface ESLMediaManager {
	[key: string]: ESLMedia
}

const managerMap: ESLMediaManager = {};

export class MediaGroupRestrictionManager {
	/**
	 * @debug info
	 */
	static get _managerMap() {
		return managerMap;
	}

	/**
	 * Register instance play state in group
	 */
	public static registerPlay(instance: ESLMedia) {
		if (instance.group) {
			const current = managerMap[instance.group];
			if (current && current !== instance && current.active) {
				if (current.$$fireNs('mangedpause')) {
					current.pause();
				}
			}
			managerMap[instance.group] = instance;
		}
	}

	/**
	 * Unregister instance
	 */
	public static unregister(instance: ESLMedia) {
		if (instance.group) {
			const reg = managerMap[instance.group];
			if (reg === instance) {
				managerMap[instance.group] = null;
			}
		}
	}
}

export default MediaGroupRestrictionManager;
