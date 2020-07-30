export type ScrollStrategy = 'none' | 'native' | 'pseudo';

const $html = document.documentElement;
export class ScrollUtility {
    /**
     * Check vertical scroll based on content height
     * */
    static hasVerticalScroll(target = $html) {
        return target.scrollHeight > target.clientHeight;
    }
    /**
     * Disable/enable scroll on the page.
     * @param state - true to disable scroll
     * @param [strategy] - to make scroll visually disabled
     * (currently use padding hack, gray color for scroll can be used instead)
     * */
    public static toggleScroll(state: boolean, strategy?: ScrollStrategy) {
        strategy = strategy || 'pseudo';
        const hasScroll = ScrollUtility.hasVerticalScroll();
        if (strategy !== 'none' && hasScroll) {
            $html.classList.toggle(`esl-${strategy}-scroll`, !state);
        }
        $html.classList.toggle('esl-disable-scroll', !state);
    }
}




