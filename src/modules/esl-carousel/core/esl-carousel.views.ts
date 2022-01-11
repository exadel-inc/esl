// Views
import {ESLCarouselViewRegistry} from './view/esl-carousel-view';
import {ESLMultiCarouselView} from './view/esl-multi-carousel-view';
import {ESLSlideCarouselView} from './view/esl-slide-carousel-view';

ESLCarouselViewRegistry.instance.registerView('multiple', ESLMultiCarouselView);
ESLCarouselViewRegistry.instance.registerView('slide', ESLSlideCarouselView);
