export interface LoadScriptAttributes {
  crossorigin?: boolean | 'anonymous' | 'use-credentials' | '';
  integrity?: string;
  referrerpolicy?: ReferrerPolicy;
}

/**
 * Creates new script element with specified attributes
 * Note: as the script will be added dynamically, it will be treated as async by the browser
 */
const createScript = (id: string, src: string, attrs: LoadScriptAttributes): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  Object.entries(attrs).forEach(([name, value]) => value && script.setAttribute(name, value === true ? '' : value));
  return script;
};

/**
 * Common function that loads script async
 * @param id - unique script id that is used as a marker to prevent future load
 * @param src - script src (url) to load
 * @param attrs - additional attributes to set on the script tag
 */
export function loadScript(id: string, src: string, attrs: LoadScriptAttributes = {}): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement =
      (document.getElementById(id) || createScript(id, src, attrs)) as HTMLScriptElement;
    const state = script.getAttribute('state');

    switch (state) {
      case 'success': resolve(new Event('load')); break;
      case 'error': reject(new Event('error')); break;
      default:
        script.addEventListener('load', (e: Event) => {
          script.setAttribute('state', 'success');
          resolve(e);
        });
        script.addEventListener('error', (e: Event) => {
          script.setAttribute('state', 'error');
          reject(e);
        });
    }
    if (!script.parentNode) {
      const firstScriptTag =
        document.querySelector('script') || document.querySelector('head title');
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
      } else {
        reject('Page document structure is incorrect');
      }
    }
  });
}
