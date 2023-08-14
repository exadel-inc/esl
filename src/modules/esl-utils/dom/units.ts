export type CSSSize = `${number}${'' | 'px' | 'vh' | 'vw'}`;

/**
 * @param value - CSS value string in px, vh, vw or without units. {@link CSSSize}
 * @returns number in pixels.
 */
export const resolveCSSSize = (value: CSSSize): number => {
  let num = parseInt(value, 10);
  const units = value.replace(num.toString(), '');

  if (units === 'vh') {
    num = Math.round((num / 100) * document.documentElement.clientHeight); // get percentage of viewport height in pixels
  }
  if (units === 'vw') {
    num = Math.round((num / 100) * document.documentElement.clientWidth); // get percentage of viewport width in pixels
  }

  return num;
};
