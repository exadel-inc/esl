import {sanitize} from '../../esl-utils/dom/sanitize';

import type {ESLImage} from './esl-image';

export const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
export const isEmptyImage = (src: string): boolean => src === EMPTY_IMAGE;

/**
 * Describe mods configurations
 */
export interface ESLImageRenderStrategy {
  /** Apply image from shadow loader */
  apply: (img: ESLImage, shadowImg: HTMLImageElement) => void;
  /** Clean strategy specific changes from ESLImage */
  clear: (img: ESLImage) => void;
}

/**
 * Describes object that contains strategies mapping
 */
export interface ESLImageStrategyMap {
  [mode: string]: ESLImageRenderStrategy;
}

export const STRATEGIES: ESLImageStrategyMap = {
  'cover': {
    apply(img, shadowImg): void {
      const src = shadowImg.src;
      const isEmpty = !src || isEmptyImage(src);
      img.style.backgroundImage = isEmpty ? '' : `url("${src}")`;
    },
    clear(img): void {
      img.style.backgroundImage = '';
    }
  },
  'save-ratio': {
    apply(img, shadowImg): void {
      const src = shadowImg.src;
      const isEmpty = !src || isEmptyImage(src);
      img.style.backgroundImage = isEmpty ? '' : `url("${src}")`;
      if (shadowImg.width === 0) return;
      img.style.paddingTop = isEmpty ? '' : `${(shadowImg.height * 100 / shadowImg.width)}%`;
    },
    clear(img): void {
      img.style.paddingTop = '';
      img.style.backgroundImage = '';
    }
  },
  'fit': {
    apply(img, shadowImg): void {
      const innerImg = img.attachInnerImage();
      innerImg.src = shadowImg.src;
      innerImg.removeAttribute('width');
    },
    clear(img): void {
      img.removeInnerImage();
    }
  },
  'origin': {
    apply(img, shadowImg): void {
      const innerImg = img.attachInnerImage();
      innerImg.src = shadowImg.src;
      innerImg.width = shadowImg.width / window.devicePixelRatio;
    },
    clear(img): void {
      img.removeInnerImage();
    }
  },
  'inner-svg': {
    apply(img, shadowImg): void {
      const request = new XMLHttpRequest();
      request.open('GET', shadowImg.src, true);
      request.onreadystatechange = (): void => {
        if (request.readyState !== 4 || request.status !== 200) return;
        img.innerHTML = sanitize(request.responseText, ['svg']);
      };
      request.send();
    },
    clear(img): void {
      img.innerHTML = '';
    }
  }
};
