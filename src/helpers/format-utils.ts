export const DEFAULT_ASPECT_RATIO = 16 / 9;

/**
 * Common function that returns coefficient aspect ratio
 * @param {String} ar - aspect ratio or coefficient
 * @returns {Number}
 */
export function coefficientAspectRatio(ar: string): number {
    const res = ar.match(/(\d+)[:\/](\d+)/);
    if (res) {
        const [, w, h] = res;
        return +w / +h;
    }
    return +ar || DEFAULT_ASPECT_RATIO;
}
