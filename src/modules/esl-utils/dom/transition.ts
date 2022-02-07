export function getTransitionLength(el: Element, property: string): number {
  const transitions = getComputedStyle(el).transition;
  const arr = transitions.match(new RegExp(`${property}.*?(?=,|$)`, 'g'));
  if (!arr || arr.length <= 0) return NaN;

  const transitionTimings = arr[0].match(new RegExp('(?:(\\d+).(\\d)|(\\d+))[a-z]{1,2}', 'g'));
  if (!transitionTimings || transitionTimings.length <= 0) return NaN;

  let transitionDuration = transitionTimings[0];
  const isMilliseconds = transitionDuration.indexOf('ms') !== -1;

  if (isMilliseconds) {
    transitionDuration = transitionDuration.replace('ms', '');
    return +transitionDuration;
  } else {
    transitionDuration = transitionDuration.replace('s', '');
    return +transitionDuration * 1000;
  }
}
