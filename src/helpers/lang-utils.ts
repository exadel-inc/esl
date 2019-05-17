export interface LanguageCode {
    lang: string,
    code: string
}
/**
 * get page language code
 * @returns {Object}
 */
export function getPageLanguageCode(): LanguageCode {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    const metaCountry = document.querySelector('meta[name="target_country"]');
    const country = (metaCountry && metaCountry.getAttribute('content') || 'us').toLowerCase();
    return {lang, code: lang + '-' + country};
}
