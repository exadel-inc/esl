/** Fix IE browser to allow to display alert under iframe */
export function createIframe(): HTMLElement {
  const iframe = document.createElement('iframe');
  iframe.className = 'ie-zindex-fix';
  iframe.src = 'about:blank';
  return iframe;
}
