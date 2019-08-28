export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isTouch = function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = function (query: string) {
    return window.matchMedia(query).matches;
  }

  console.log('ontouchstart' in window);
  console.log('TouchEvent ' in window);
  console.log('DocumentTouch' in window);
  console.log(document instanceof Touch);

  if (('ontouchstart' in window) || 'TouchEvent ' in window || 'DocumentTouch' in window && document instanceof Touch) {
    return true;
  }

  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}