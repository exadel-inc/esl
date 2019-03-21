import SmartMultiCarousel from './ts/smart-multi-carousel';
import SmartCarouselDots from '../smart-abstract-carousel/ts/smart-carousel-dots';

// just a stub real carousel api will be provided soon
[SmartMultiCarousel, SmartCarouselDots].forEach((Component) => {
    const component = new Component();
});
