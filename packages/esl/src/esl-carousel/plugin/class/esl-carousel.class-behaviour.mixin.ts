import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {listen} from '../../../esl-utils/decorators/listen';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ESLCarouselSlide} from '../../core/esl-carousel.slide';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

export interface ESLCarouselClassBehaviourConfig {
  mode?: 'default' | 'proactive';
}

/**
 * Plugin for {@link ESLCarousel} that allows to control the `container-class` feature behavior.
 *
 * Supports two modes:
 * - `default`: do not change default behavior - adds/removes classes on the container element after slides changed
 * - `proactive`: adds/removes classes on the container element proactively as soon as change starts
 */
export class ESLCarouselClassBehaviourMixin extends ESLCarouselPlugin<ESLCarouselClassBehaviourConfig> {
  public static override is = 'esl-carousel-class-behavior';
  public static override DEFAULT_CONFIG: ESLCarouselClassBehaviourConfig = {
    mode: 'default'
  };
  public static override DEFAULT_CONFIG_KEY: keyof ESLCarouselClassBehaviourConfig = 'mode';

  @listen({inherit: true})
  protected override onConfigChange(): void {
    super.onConfigChange();
    this.$$on(this.onSlideChange);
  }

  /** Resolves the container classes from given slide element */
  protected getClasses($slide: HTMLElement): string | undefined {
    return ESLCarouselSlide.get($slide)?.containerClass;
  }

  @listen({
    event: ESLCarouselSlideEvent.CHANGE,
    condition: ($this: ESLCarouselClassBehaviourMixin) => $this.config.mode === 'proactive',
  })
  protected onSlideChange({$slidesBefore, $slidesAfter}: ESLCarouselSlideEvent): void {
    const {$container} = this.$host;
    if (!$container) return;
    for (const $slide of $slidesBefore) {
      CSSClassUtils.remove($container, this.getClasses($slide), $slide);
    }
    for (const $slide of $slidesAfter) {
      CSSClassUtils.add($container, this.getClasses($slide), $slide);
    }
  }
}
