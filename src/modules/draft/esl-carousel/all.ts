// Views
import './core/view/esl-single-carousel-view';
import './core/view/esl-multi-carousel-view';

export * from './core/esl-carousel';

// Plugins
import {ESLCarouselDotsPlugin} from './plugin/esl-carousel-dots.plugin';
import {ESLCarouselLinkPlugin} from './plugin/esl-carousel-link.plugin';
import {ESLCarouselTouchPlugin} from './plugin/esl-carousel-touch.plugin';
import {ESLCarouselAutoplayPlugin} from './plugin/esl-carousel-autoplay.plugin';

// TODO: ??
export const ESLCarouselPlugins = {
  Dots: ESLCarouselDotsPlugin,
  Link: ESLCarouselLinkPlugin,
  Touch: ESLCarouselTouchPlugin,
  Autoplay: ESLCarouselAutoplayPlugin
};
