import SmartMulticarousel from './ts/smart-multicarousel';
import SmartMulticarouselDots from './ts/smart-multicarousel-dots';

const COMPONENTS_LIST: any[] = [SmartMulticarousel, SmartMulticarouselDots];

COMPONENTS_LIST.forEach((Component) => {
	const component = new Component();
});
