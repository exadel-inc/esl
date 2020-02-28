// TODO: move to constants, or possibly we even need one accessible place for constants to simplify initial configuration
export const DEFAULT_ASPECT_RATIO = 16 / 9;

/**
 * Convert string to kebab-case notation
 */
export const toKebabCase = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};

/**
 * Common function that returns coefficient aspect ratio
 * Supported formats: w:h, w/h, coefficient
 * @example '16:9', '16/9', '1.77'
 * @param {String} str - parse string
 * @returns {Number} - aspect ratio coefficient
 */
export function parseAspectRatio(str: string): number {
    const res = str.match(/(\d+)[:\/](\d+)/);
    if (res) {
        const [, w, h] = res;
        return +w / +h;
    }
    return +str || DEFAULT_ASPECT_RATIO; // TODO: revisit logic, most likely we should not have default here
}
