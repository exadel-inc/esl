// Views
import './ts/view/esl-single-carousel-view';
import './ts/view/esl-multi-carousel-view';

export * from './ts/esl-carousel';

// Plugins
import {ESLCarouselDotsPlugin} from './ts/plugin/esl-carousel-dots.plugin';
import {ESLCarouselLinkPlugin} from './ts/plugin/esl-carousel-link.plugin';
import {ESLCarouselTouchPlugin} from './ts/plugin/esl-carousel-touch.plugin';
import {ESLCarouselAutoplayPlugin} from './ts/plugin/esl-carousel-autoplay.plugin';

// TODO: ??
export const CarouselPlugins = {
  Dots: ESLCarouselDotsPlugin,
  Link: ESLCarouselLinkPlugin,
  Touch: ESLCarouselTouchPlugin,
  Autoplay: ESLCarouselAutoplayPlugin
};
