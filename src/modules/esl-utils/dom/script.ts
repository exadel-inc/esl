export interface loadScriptOptions {
  crossorigin?: boolean | 'anonymous' | 'use-credentials' | '';
  integrity?: string;
  referrerpolicy?: ReferrerPolicy;
}

/**
 * Creates new script element with specified attributes
 */
const createScript = (id: string, src: string, options: loadScriptOptions): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  Object.entries(options).forEach(([name, value]) => value && script.setAttribute(name, value === true ? '' : value));
  return script;
};

/**
 * Common function that loads script async
 * @param id - unique script id that is used as a marker to prevent future load
 * @param src - script src (url) to load
 * @param options - additional attributes to set on the script tag
 */
export function loadScript(id: string, src: string, options: loadScriptOptions = {}): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement =
      (document.getElementById(id) || createScript(id, src, options)) as HTMLScriptElement;
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
