import {ESLImage} from './esl-image';

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
    apply(img, shadowImg) {
      const src = shadowImg.src;
      const isEmpty = !src || ESLImage.isEmptyImage(src);
      img.style.backgroundImage = isEmpty ? '' : `url("${src}")`;
    },
    clear(img) {
      img.style.backgroundImage = '';
    }
  },
  'save-ratio': {
    apply(img, shadowImg) {
      const src = shadowImg.src;
      const isEmpty = !src || ESLImage.isEmptyImage(src);
      img.style.backgroundImage = isEmpty ? '' : `url("${src}")`;
      if (shadowImg.width === 0) return;
      img.style.paddingTop = isEmpty ? '' : `${(shadowImg.height * 100 / shadowImg.width)}%`;
    },
    clear(img) {
      img.style.paddingTop = '';
      img.style.backgroundImage = '';
    }
  },
  'fit': {
    apply(img, shadowImg) {
      const innerImg = img.attachInnerImage();
      innerImg.src = shadowImg.src;
      innerImg.removeAttribute('width');
    },
    clear(img) {
      img.removeInnerImage();
    }
  },
  'origin': {
    apply(img, shadowImg) {
      const innerImg = img.attachInnerImage();
      innerImg.src = shadowImg.src;
      innerImg.width = shadowImg.width / window.devicePixelRatio;
    },
    clear(img) {
      img.removeInnerImage();
    }
  },
  'inner-svg': {
    apply(img, shadowImg) {
      const request = new XMLHttpRequest();
      request.open('GET', shadowImg.src, true);
      request.onreadystatechange = () => {
        if (request.readyState !== 4 || request.status !== 200) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = request.responseText;
        Array.from(tmp.querySelectorAll('script') || [])
          .forEach((node: Element) => node.remove());
        img.innerHTML = tmp.innerHTML;
      };
      request.send();
    },
    clear(img) {
      img.innerHTML = '';
    }
  }
};
