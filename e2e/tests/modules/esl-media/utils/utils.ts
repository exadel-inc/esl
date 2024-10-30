import type {ESLMedia} from '@exadel/esl/modules/esl-media/core/esl-media';
import type {JSHandle} from 'puppeteer';

export const createMediaElement = async (props: Partial<ESLMedia>): Promise<JSHandle<ESLMedia>> => {

  return page.evaluateHandle((pr: Partial<ESLMedia>) => {
    const toKebabCase = (str: string): string => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

    const $media = document.createElement('esl-media');
    Object.entries(pr).forEach(([attr, value]) => {
      $media.setAttribute(toKebabCase(attr), value?.toString() || '');
    });
    document.body.appendChild($media);
    return $media;
  }, JSON.parse(JSON.stringify(props))) as unknown as JSHandle<ESLMedia>;
};
