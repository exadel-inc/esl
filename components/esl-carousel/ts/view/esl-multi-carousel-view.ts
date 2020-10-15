import {ESLCarouselView, ESLCarouselViewRegistry} from './esl-carousel-view';
import ESLCarousel from '../esl-carousel';

class ESLMultiCarouselView extends ESLCarouselView {
  constructor(carousel: ESLCarousel) {
    super(carousel);
  }

  // tslint:disable-next-line:no-empty
  public bind() {
  }

  public draw() {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    const currentTrans = slideStyles.transform !== 'none' ? parseFloat(slideStyles.transform.split(',')[4]) : 0;
    const slidesAreaStyles = getComputedStyle($slidesArea);

    const slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount
      - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
    const computedLeft = this.carousel.firstIndex === 0 ?
      -currentTrans :
      -(parseFloat(slidesAreaStyles.width) / this.carousel.activeCount * this.carousel.firstIndex) - currentTrans;


    $slides.forEach((slide) => {
      slide.style.minWidth = slideWidth + 'px';
      slide.style.left = computedLeft + 'px';
    });
  }

  public goTo(nextIndex: number, direction: string) {
    const slideIndex = direction === 'right' ? this.carousel.activeIndexes[0] : this.carousel.firstIndex;
    const slideStyles = getComputedStyle(this.carousel.$slides[slideIndex]);
    const slideWidth = parseFloat(slideStyles.width) +
      parseFloat(slideStyles.marginLeft) +
      parseFloat(slideStyles.marginRight);
    const areaWidth = slideWidth * this.carousel.$slides.length;

    const transitionDuration = parseFloat(slideStyles.transitionDuration) * 1000; // ms
    const currentLeft = parseFloat(slideStyles.left);
    const currentTrans = parseFloat(slideStyles.transform.split(',')[4]) || 0;

    if (this.carousel.firstIndex === nextIndex) {
      return 0;
    }

    let shiftCount = 0;
    if (direction === 'left') {
      shiftCount = (this.carousel.firstIndex - nextIndex + this.carousel.count) % this.carousel.count;
    } else if (direction === 'right') {
      shiftCount = (this.carousel.count - this.carousel.firstIndex + nextIndex) % this.carousel.count;
    }
    const direct = direction === 'left' ? -1 : 1;
    const trans = currentTrans - (shiftCount * slideWidth) * direct;

    const nextActiveIndexes: number[] = [];
    for (let i = 0; i < this.carousel.activeCount; ++i) {
      nextActiveIndexes.push((nextIndex + i + this.carousel.count) % this.carousel.count);
    }

    const intersectionArr = nextActiveIndexes.filter(
      (index: number) => this.carousel.activeIndexes.indexOf(index) !== -1
    );

    let left = 0;
    const animatedCount = shiftCount < this.carousel.activeCount ? this.carousel.activeCount : shiftCount;
    for (let i = 0; i < animatedCount; ++i) {
      const computedIndex = (nextIndex + i + this.carousel.count) % this.carousel.count;
      const minActive = Math.min(...this.carousel.activeIndexes);
      // make next active slides be in one line
      if (computedIndex >= this.carousel.firstIndex && direction === 'left') {
        left = currentLeft - areaWidth;
      } else if (computedIndex <= minActive && direction === 'right') {
        left = currentLeft + areaWidth;
      } else {
        left = currentLeft;
      }

      // exclude slides that are active now and have to be active then
      if (intersectionArr.indexOf(computedIndex) === -1) {
        this.carousel.$slides[computedIndex].style.left = left + 'px';
      }

      // handle slides that are active now and have to be active then
      if (intersectionArr.indexOf(computedIndex) !== -1) {
        const orderIndex = nextActiveIndexes.indexOf(computedIndex);
        const time = (direction === 'right') ?
          (transitionDuration / this.carousel.activeCount) * orderIndex :
          (transitionDuration / this.carousel.activeCount) * (this.carousel.activeCount - orderIndex - 1);
        const copyLeft = left;
        setTimeout(() => {
          this.carousel.$slides[computedIndex].style.left = copyLeft + 'px';
        }, time);
      }

    }

    this.carousel.$slides.forEach((slide) => {
      // exclude slides that are active now and have to be active then

      slide.style.transform = `translateX(${trans}px)`;

      // handle slides that are active now and have to be active then
      const sIndex = slide.index;
      if (intersectionArr.indexOf(sIndex) !== -1) {
        const orderIndex = nextActiveIndexes.indexOf(sIndex);
        const time = (direction === 'right') ?
          (transitionDuration / this.carousel.activeCount) * orderIndex :
          (transitionDuration / this.carousel.activeCount) * (this.carousel.activeCount - orderIndex - 1);
        setTimeout(() => {
          this.carousel.$slides[sIndex].style.transform = `translateX(${trans}px)`;
        }, time);
      }
    });

    this.carousel.setAttribute('data-is-animated', 'true');

    setTimeout(() => {
      this.carousel.removeAttribute('data-is-animated');
    }, transitionDuration);

  }

  public unbind() {
    this.carousel.$slides.forEach((el) => {
      el.style.transform = 'none';
      el.style.left = 'none';
    });
  }
}

ESLCarouselViewRegistry.instance.registerView('multiple', ESLMultiCarouselView);

export default ESLMultiCarouselView;
