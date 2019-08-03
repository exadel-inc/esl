/**
 * Group restriction manager for {@link SmartVideo}
 * Only one video in group can be played
 * Empty group is ignored
 * @version 1.0.1
 * @author Alexey Stsefanovich (ala'n)
 */
import SmartVideo from './smart-video';


interface VideoManager {
	[key: string]: SmartVideo
}

const managerMap: VideoManager = {};


export class VideoGroupRestrictionManager {
	/**
	 * @debug info
	 */
	static get _managerMap() {
		return managerMap;
	}

	/**
	 * Register instance play state in group
	 */
	public static registerPlay(instance: SmartVideo) {
		if (instance.group) {
			const current = managerMap[instance.group];
			if (current && current !== instance && current.active) {
				if (current.dispatchEvent(new Event('evideo:mangedpause', {bubbles: true}))) {
					current.pause();
				}
			}
			managerMap[instance.group] = instance;
		}
	}

	/**
	 * Unregister instance
	 */
	public static unregister(instance: SmartVideo) {
		if (instance.group) {
			const reg = managerMap[instance.group];
			if (reg === instance) {
				managerMap[instance.group] = null;
			}
		}
	}
}

export default VideoGroupRestrictionManager;
