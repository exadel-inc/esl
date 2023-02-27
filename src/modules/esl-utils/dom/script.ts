/**
 * Creates new async script tag by id and src
 */
const createAsyncScript = (id: string, src: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  return script;
};

/**
 * Common function that loads script async
 * @param id - unique script id that is used as a marker to prevent future load
 * @param src - script src (url) to load
 */
export function loadScript(id: string, src: string): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = (document.getElementById(id) ||
      createAsyncScript(id, src)) as HTMLScriptElement;
    const state = script.getAttribute('state');

    switch (state) {
      case 'success':
        resolve(new Event('load'));
        break;
      case 'error':
        reject(new Event('error'));
        break;
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
