import {range} from '../../../src/modules/esl-utils/misc/array';
import {onDocumentReady} from '../../../src/modules/esl-utils/dom/ready';

const STARS_SEL = [
  '#esl-logo-shield-stars > path',
  '#esl-logo-border-inner-stars > path',
  '#esl-logo-border-outer-stars > path',
  '#esl-logo-wrench-left-stars > path',
  '#esl-logo-wrench-right-stars > path'
].join(',');

onDocumentReady(() => {
  let $active: HTMLElement[] = [];
  const $stars: HTMLElement[] = Array.from(document.querySelectorAll(STARS_SEL)) ;

  const randomIndex = () => Math.floor(Math.random() * $stars.length);
  const randomStar = () => $stars[randomIndex()];

  setInterval(() => {
    const $candidates = range(4, randomStar);
    $active.forEach((star) => star.classList.remove('animate'));
    $candidates.forEach((star) => star.classList.add('animate'));
    $active = $candidates;
  }, 3000);
});
