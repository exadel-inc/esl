import SmartCarousel from '../../smart-carousel/ts/smart-carousel';

class SmartCarouselAnimation {

    protected _carousel: SmartCarousel;

    constructor(carousel: SmartCarousel) {
        this._carousel = carousel;
    }

    public animate(event: CustomEvent) {
        // common function
    }
}

export default SmartCarouselAnimation;
