import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

export class ESLCarouselDummyRenderer extends ESLCarouselRenderer {
  public static override is = 'default';

  public override onAnimate = jest.fn();
  public override move = jest.fn();
  public override commit = jest.fn();
}
