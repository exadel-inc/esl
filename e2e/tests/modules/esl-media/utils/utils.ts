import {toKebabCase} from '@exadel/esl/modules/esl-utils/misc/format';
import type {ESLMedia} from '@exadel/esl/modules/esl-media/core/esl-media';
import type {JSHandle} from 'puppeteer';

export const createMediaElement = async (props: Partial<ESLMedia>): Promise<JSHandle<ESLMedia>> => {
  return page.evaluate((pr: Partial<ESLMedia>, toKebabCaseStr: string) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const toKebabCaseFn = new Function('return ' + toKebabCaseStr)();
    const $media = document.createElement('esl-media');
    Object.entries(pr).forEach(([attr, value]) => {
      $media.setAttribute(toKebabCaseFn(attr), value?.toString() || '');
    });
    document.body.appendChild($media);
    return $media;
  }, JSON.parse(JSON.stringify(props)), toKebabCase.toString()) as unknown as JSHandle<ESLMedia>;
};
