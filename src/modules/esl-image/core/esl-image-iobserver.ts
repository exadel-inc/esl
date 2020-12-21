/**
 * ESL Image Play-In-Viewport helper
 * @version 1.0.0-alpha
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
import ESLImage from './esl-image';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';

let iObserver: IntersectionObserver;

export function getIObserver() {
  if (!iObserver) {
    iObserver = new IntersectionObserver(function (entries) {
      entries.forEach(handleViewport);
    }, {
      threshold: [0.01], // 0 + 1 are not correctly handled by all browsers
      rootMargin: DeviceDetector.isMobile ? '250px' : '500px' // rootMargin value for IntersectionObserver
    });
  }
  return iObserver;
}

function handleViewport(entry: IntersectionObserverEntry) {
  const {target: image} = entry;
  if (!(image instanceof ESLImage)) return;

  // Check that entry is going to appear in the viewport area
  if (entry.isIntersecting || entry.intersectionRatio > 0) {
    image.triggerLoad();
  }
}
