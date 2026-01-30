import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

export class ESLCarouselDummyRenderer extends ESLCarouselRenderer {
  public static override is = 'default';

  public override onAnimate = vi.fn();
  public override move = vi.fn();
  public override commit = vi.fn();
}
