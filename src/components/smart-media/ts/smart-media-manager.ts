/**
 * Group restriction manager for {@link SmartMedia}
 * Only one media in group can be played
 * Empty group is ignored
 * @version 1.0.1
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
import SmartMedia from './smart-media';

interface SmartMediaManager {
	[key: string]: SmartMedia
}

const managerMap: SmartMediaManager = {};

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
	public static registerPlay(instance: SmartMedia) {
		if (instance.group) {
			const current = managerMap[instance.group];
			if (current && current !== instance && current.active) {
				if (current.dispatchCustomEvent('mangedpause')) {
					current.pause();
				}
			}
			managerMap[instance.group] = instance;
		}
	}

	/**
	 * Unregister instance
	 */
	public static unregister(instance: SmartMedia) {
		if (instance.group) {
			const reg = managerMap[instance.group];
			if (reg === instance) {
				managerMap[instance.group] = null;
			}
		}
	}
}

export default MediaGroupRestrictionManager;
