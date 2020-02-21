import SmartMedia from './smart-media';

const RATIO_TO_ACTIVATE = 0.75; // TODO: customizable
const RATIO_TO_DEACTIVATE = 0.20; // TODO: customizable

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
	if (!(video instanceof SmartMedia)) return;

	// Videos that playing and out of min ratio RATIO_TO_DEACTIVATE should be stopped
	if (video.active && entire.intersectionRatio <= RATIO_TO_DEACTIVATE) {
		video.pause();
	}
	// TODO: muted control ? do we need
	// Play should starts only for inactive and background(muted) videos that are visible more then on RATIO_TO_ACTIVATE
	if (!video.active && video.autoplay && entire.intersectionRatio >= RATIO_TO_ACTIVATE) {
		video.play();
	}
}
