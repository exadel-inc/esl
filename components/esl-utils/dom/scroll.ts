import {DeviceDetector} from '../enviroment/device-detector';

const $html = document.documentElement;
export class ScrollUtility {
    /**
     * Check vertical scroll based on content height
     * */
    static hasVerticalScroll(target = $html) {
        return target.scrollHeight > target.clientHeight;
    }

    // left scroll in ie only
    static get isRTL () {
        return $html.getAttribute('dir') === 'rtl' && DeviceDetector.isIE;
    }
    /**
     * Disable/enable scroll on the page.
     * @param {boolean} state - true to disable scroll
     * @param {boolean} strategy - to make scroll visually disabled
     * (currently use padding hack, gray color for scroll can be used instead)
     * */
    public static toggleScroll(state: boolean, strategy: 'none' | 'padding' = 'padding') {
        const scrollWidth = window.innerWidth - $html.clientWidth;
        $html.style.removeProperty('overflow');
        !state && ($html.style.overflow = 'hidden');

        if (strategy === 'padding') {
            const paddingProp = ScrollUtility.isRTL ? 'padding-left' : 'padding-right';
            $html.style.removeProperty(paddingProp);
            !state && $html.style.setProperty(paddingProp, `${scrollWidth}px`);
        }
    }
}




