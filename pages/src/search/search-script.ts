import {loadScript} from '../../../modules/esl-utils/dom/script';

export function loadSearchScript(): Promise<Event> {
  return loadScript('gss', 'https://cse.google.com/cse.js?cx=3171f866738b34f02');
}
