import SmartCarousel from '../../smart-carousel/ts/smart-carousel';

abstract class SmartCarouselAnimation {

    protected carousel: SmartCarousel;

    protected constructor(carousel: SmartCarousel) {
        this.carousel = carousel;
    }

    public abstract animate(nextIndex: number, direction: string): void;
}

export default SmartCarouselAnimation;
