import {ESLImageContainerMixin} from '../core';
import {ESLTestTemplate} from '../../test/template';

describe('ESLImageContainerMixin', () => {
  beforeAll(() => {
    ESLImageContainerMixin.register();
  });

  describe('ESLImageContainerMixin is applied in common case', () => {
    const template = ESLTestTemplate.create(`
      <div class="img-container" esl-image-container>
        <img src="/test.jpg" alt="img"/>
      </div>`
    ).bind('beforeall');

    test('ESLImageContainerMixin is initialized', () => {
      expect(ESLImageContainerMixin.get(template.get('div[esl-image-container]')!)).toBeDefined();
    });

    test('Ready class is not added before image is loaded', async () => {
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Ready class is added after image is loaded', async () => {
      template.dispatchImageLoadEvent('img');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(true);
    });
  });

  describe('ESLImageContainerMixin is applied in img tag', () => {
    const template = ESLTestTemplate.create(`
      <img src="/test.jpg" alt="img" esl-image-container>`
    ).bind('beforeall');

    test('ESLImageContainerMixin is initialized', () => {
      expect(ESLImageContainerMixin.get(template.get('img[esl-image-container]')!)).toBeDefined();
    });

    test('Ready class is not added before image is loaded', async () => {
      await Promise.resolve();
      expect(template.has('img[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Ready class is added after image is loaded', async () => {
      template.dispatchImageLoadEvent('img');
      await Promise.resolve();
      expect(template.has('img[esl-image-container].img-container-loaded')).toBe(true);
    });
  });

  describe('ESLImageContainerMixin observes all images in container', () => {
    const template = ESLTestTemplate.create(`
      <div class="img-container" esl-image-container>
        <img id="img1" src="/test.jpg" alt="img"/>
        <img id="img2" src="/test.jpg" alt="img"/>
      </div>`
    ).bind('beforeall');

    test('Ready class is not added before images are loaded', async () => {
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Ready class is not added after one image is loaded', async () => {
      template.dispatchImageLoadEvent('#img1');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Ready class is added after all images are loaded', async () => {
      template.dispatchImageLoadEvent('img');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(true);
    });
  });

  describe('ESLImageContainerMixin handles image loading errors', () => {
    const template = ESLTestTemplate.create(`
      <div class="img-container" esl-image-container="{errorCls: 'img-container-error'}">
        <img id="img1" src="/test.jpg" alt="img"/>
        <img id="img2" src="/test.jpg" alt="img"/>
      </div>`
    ).bind('beforeall');

    test('Error class is not added before images are loaded', async () => {
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Error class is not added after one image is loaded', async () => {
      template.dispatchImageLoadEvent('#img1', 'error');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Error class is added after one image has loading error', async () => {
      template.dispatchImageLoadEvent('#img1', 'error');
      template.dispatchImageLoadEvent('#img2', 'error');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(true);
      expect(template.has('div[esl-image-container].img-container-error')).toBe(true);
    });
  });

  describe('ESLImageContainerMixin handles ready class customization', () => {
    const template = ESLTestTemplate.create(`
      <div class="img-container" esl-image-container="{readyCls: 'img-container-ready'}">
        <img id="img1" src="/test.jpg" alt="img"/>
        <img id="img2" src="/test.jpg" alt="img"/>
      </div>`
    ).bind('beforeall');

    test('Ready class is not added before images are loaded', async () => {
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-ready')).toBe(false);
    });

    test('Ready class is added after all images are loaded', async () => {
      template.dispatchImageLoadEvent('img');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-ready')).toBe(true);
      // Default class is not added
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });
  });

  describe('ESLImageContainerMixin handles custom selector', () => {
    const template = ESLTestTemplate.create(`
      <div class="img-container" esl-image-container="{selector: '#img2'}">
        <img id="img1" src="/test.jpg" alt="img"/>
        <img id="img2" src="/test.jpg" alt="img"/>
      </div>`
    ).bind('beforeall');

    test('Ready class is not added before images are loaded', async () => {
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(false);
    });

    test('Ready class is added after all images are loaded', async () => {
      template.dispatchImageLoadEvent('#img2');
      await Promise.resolve();
      expect(template.has('div[esl-image-container].img-container-loaded')).toBe(true);
    });
  });
});
