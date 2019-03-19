import SmartMultiCarousel from './ts/smart-multi-carousel';
import SmartMultiCarouselDots from './ts/smart-multi-carousel-dots';

const COMPONENTS_LIST: any[] = [SmartMultiCarousel, SmartMultiCarouselDots];

COMPONENTS_LIST.forEach((Component) => {
    const component = new Component();
});
