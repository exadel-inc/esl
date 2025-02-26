import type {ESLMedia} from './esl-media';

let iObserver: IntersectionObserver;

/** ESL Media Play-In-Viewport IntersectionObserver instance */
export function getIObserver(lazy: boolean = false): IntersectionObserver {
  if (!iObserver && !lazy) {
    iObserver = new IntersectionObserver(function (entries) {
      entries.forEach(handleViewport);
    }, {
      threshold: [0.05, 0.1, 0.25, 0.33, 0.5, 0.66, 0.75, 0.9, 1]
    });
  }
  return iObserver;
}

function handleViewport(entry: IntersectionObserverEntry): void {
  const video = entry.target as ESLMedia;
  const root = entry.rootBounds || {
    width: Number.POSITIVE_INFINITY,
    height: Number.POSITIVE_INFINITY
  };
  const rect = entry.intersectionRect;
  const ratio = Math.max(
    (rect.width * rect.height) / (root.width * root.height),
    entry.intersectionRatio
  );

  // Removes `lazy` attribute when media is in the viewport with min ratio RATIO_TO_ACTIVATE
  if (entry.isIntersecting && ratio >= video.RATIO_TO_ACTIVATE && video.lazy === 'auto') {
    video.$$attr('lazy', false);
  }

  // Skip if video state management if feature is disabled
  if (!video.playInViewport) return;

  // Videos that playing and out of min ratio should be stopped
  if (video.active && ratio <= video.RATIO_TO_STOP) {
    video.pause(true);
  }
  // Videos that not playing and in min ratio to start should be started
  if (!video.active && ratio >= video.RATIO_TO_PLAY) {
    // Disallow for non autoplay-able videos or videos that was controlled by user
    if (!video.autoplay || video.isUserInitiated) return;
    video.play(false, true);
  }
}
