import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLCSSCarouselRenderer} from './esl-carousel.css.renderer';

@ESLCarouselRenderer.register
export class ESLCSSFadeCarouselRenderer extends ESLCSSCarouselRenderer {
  public static override is = 'css-fade';
  public static override classes: string[] = [
    ...ESLCSSCarouselRenderer.classes,
    'esl-carousel-css-fade'
  ];
}
