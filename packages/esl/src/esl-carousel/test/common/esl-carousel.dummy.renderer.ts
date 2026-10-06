import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

import type {Mock} from 'vitest';

export class ESLCarouselDummyRenderer extends ESLCarouselRenderer {
  public static override is = 'default';

  public override onAnimate: Mock<ESLCarouselRenderer['onAnimate']> = vi.fn();
  public override move: Mock<ESLCarouselRenderer['move']> = vi.fn();
  public override commit: Mock<ESLCarouselRenderer['commit']> = vi.fn();
}
