import SmartCarouselAnimation from '../../smart-carousel-animation/ts/smart-carousel-animation';
import SmartSingleCarouselAnimation from '../../smart-carousel-animation/ts/smart-single-carousel-animation';
import SmartCarousel from './smart-carousel';
import SmartMultiCarouselAnimation from '../../smart-carousel-animation/ts/smart-multi-carousel-animation';

interface Strategy {
    [type: string]: (carousel: SmartCarousel) => SmartCarouselAnimation
}

const STRATEGIES: Strategy = {
    single: (carousel: SmartCarousel) => new SmartSingleCarouselAnimation(carousel),
    multi: (carousel: SmartCarousel) => new SmartMultiCarouselAnimation(carousel),
};

class SmartCarouselStrategy {

    private readonly _carousel: SmartCarousel;
    private animation: SmartCarouselAnimation;

    constructor(carousel: SmartCarousel) {
        this._carousel = carousel;
    }

    public setStrategy(type: string) {
        this.animation = STRATEGIES[type](this._carousel);
    }

    public animate(event: CustomEvent) {
        this.animation.animate(event);
    }
}

export default SmartCarouselStrategy;
