export type CSSSize = `${number}${'' | 'px' | 'vh' | 'vw'}`;

/**
 * @param value - CSS value string in px, vh, vw or without units. {@link CSSSize}
 * @returns number in pixels.
 */
export const resolveCSSSize = (value: CSSSize): number | null => {
  let units = 'px';

  ['px', 'vh', 'vw'].forEach((item) => {
    if (value.indexOf(item) > 0) {
      units = item;
    }
  });

  const num = parseFloat(value.replace(units, ''));

  if (!num) {
    return null;
  }

  if (units === 'vh') {
    return Math.round((num / 100) * document.documentElement.clientHeight); // get percentage of viewport height in pixels
  }
  if (units === 'vw') {
    return Math.round((num / 100) * document.documentElement.clientWidth); // get percentage of viewport width in pixels
  }

  return num;
};
