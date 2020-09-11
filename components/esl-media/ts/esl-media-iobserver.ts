/**
 * ESL Media Play-In-Viewport helper
 * @version 1.2.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
import ESLMedia from './esl-media';

const RATIO_TO_ACTIVATE = 0.75; // TODO: customizable, at least global
const RATIO_TO_DEACTIVATE = 0.20; // TODO: customizable, at least global

let iObserver: IntersectionObserver;

export function getIObserver(lazy: boolean = false) {
	if (!iObserver && !lazy) {
		iObserver = new IntersectionObserver(function (entries) {
			entries.forEach(handleViewport);
		}, {
			threshold: [RATIO_TO_DEACTIVATE, RATIO_TO_ACTIVATE]
		});
	}
	return iObserver;
}

function handleViewport(entire: IntersectionObserverEntry) {
	const {target: video} = entire;
	if (!(video instanceof ESLMedia)) return;

	// Videos that playing and out of min ratio RATIO_TO_DEACTIVATE should be stopped
	if (video.active && entire.intersectionRatio <= RATIO_TO_DEACTIVATE) {
		video.pause();
	}
	// Play should starts only for inactive and background(muted) videos that are visible more then on RATIO_TO_ACTIVATE
	if (!video.active && video.autoplay && entire.intersectionRatio >= RATIO_TO_ACTIVATE) {
		video.play();
	}
}
