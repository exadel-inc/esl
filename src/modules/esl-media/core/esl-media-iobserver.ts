import type {ESLMedia} from './esl-media';

const RATIO_TO_PLAY = 0.5; // TODO: customizable, at least global
const RATIO_TO_STOP = 0.20; // TODO: customizable, at least global

const RATIO_TO_ACTIVATE = 0.05;

let iObserver: IntersectionObserver;

/** ESL Media Play-In-Viewport IntersectionObserver instance */
export function getIObserver(lazy: boolean = false): IntersectionObserver {
  if (!iObserver && !lazy) {
    iObserver = new IntersectionObserver(function (entries) {
      entries.forEach(handleViewport);
    }, {
      threshold: [RATIO_TO_STOP, RATIO_TO_PLAY]
    });
  }
  return iObserver;
}

function handleViewport(entry: IntersectionObserverEntry): void {
  const video = entry.target as ESLMedia;
  // Removes `lazy` attribute when media is in the viewport with min ratio RATIO_TO_ACTIVATE
  if (entry.isIntersecting && entry.intersectionRatio >= RATIO_TO_ACTIVATE && video.lazy === 'auto') {
    video.$$attr('lazy', false);
  }

  // Videos that playing and out of min ratio RATIO_TO_STOP should be stopped
  if (entry.intersectionRatio <= RATIO_TO_STOP) video.$$attr('in-viewport', false);
  // Play should start only for inactive and background(muted) videos that are visible more than on RATIO_TO_PLAY
  if (entry.intersectionRatio >= RATIO_TO_PLAY) video.$$attr('in-viewport', true);
}
