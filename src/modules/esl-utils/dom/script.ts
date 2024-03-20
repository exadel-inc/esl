/**
 * Creates new script element with specified attributes
 */
const createScript = (attrs: Record<string, string | boolean>): HTMLScriptElement => {
  const script = document.createElement('script');
  Object.entries(attrs).forEach(([name, value]) => value && script.setAttribute(name, value === true ? '' : value));
  return script;
};

/**
 * Common function that loads script async
 * @param id - unique script id that is used as a marker to prevent future load
 * @param src - script src (url) to load
 * @param options - additional attributes to set on the script tag
 */
export function loadScript(id: string, src: string, options: Record<string, string | boolean> = {}): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement =
      (document.getElementById(id) || createScript({async: true, ...options, src, id})) as HTMLScriptElement;
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
