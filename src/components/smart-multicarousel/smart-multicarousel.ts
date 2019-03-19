import SmartMulticarousel from './ts/smart-multicarousel';
import SmartMulticarouselDots from './ts/smart-multicarousel-dots';

// just a stub real carousel api will be provided soon
[SmartMulticarousel, SmartMulticarouselDots].forEach((Component) => {
	const component = new Component();
});
