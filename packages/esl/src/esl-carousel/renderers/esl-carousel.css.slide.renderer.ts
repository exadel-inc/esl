import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLCSSCarouselRenderer} from './esl-carousel.css.renderer';

@ESLCarouselRenderer.register
export class ESLCSSSlideCarouselRenderer extends ESLCSSCarouselRenderer {
  public static override is = 'css-slide';
  public static override classes: string[] = [
    ...ESLCSSCarouselRenderer.classes,
    'esl-carousel-css-slide'
  ];
}
