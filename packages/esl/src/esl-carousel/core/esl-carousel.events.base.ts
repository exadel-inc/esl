import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselDirection} from './esl-carousel.types';

/** Base interface for all {@link ESLCarousel} action events */
export interface ESLCarouselActionEventBaseInit {
  /** A list of indexes of slides that were active before the change */
  indexesBefore: number[];
  /** A list of indexes of slides that are active after the change */
  indexesAfter: number[];
  /** Whether the slide change is final (leads to actual active slide change) */
  final?: boolean;
  /** Auxiliary request attribute that represents object that initiates slide change */
  activator?: any;
}

/** Abstract base class for all {@link ESLCarousel} action events */
export abstract class ESLCarouselActionEvent extends Event implements ESLCarouselActionEventBaseInit {
  public override readonly target: ESLCarousel;

  public readonly indexesBefore: number[];
  public readonly indexesAfter: number[];
  public readonly direction: ESLCarouselDirection;
  public readonly final: boolean = false;
  public readonly activator?: any;

  /** @returns first index of before sate */
  public get indexBefore(): number {
    return this.indexesBefore[0];
  }

  /** @returns first index of after state */
  public get indexAfter(): number {
    return this.indexesAfter[0];
  }

  /** @returns list of slides that are active before the change */
  public get $slidesBefore(): HTMLElement[] {
    return this.indexesBefore.map((index) => this.target.slideAt(index));
  }

  /** @returns list of slides that are active after the change */
  public get $slidesAfter(): HTMLElement[] {
    return this.indexesAfter.map((index) => this.target.slideAt(index));
  }
}
