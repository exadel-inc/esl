/**
 * Injects CSS styles into the document head with a unique ID to prevent duplicates.
 * @param css - The CSS string to be injected.
 * @param id - A unique identifier for the style element to avoid duplicate injections.
 */
export const injectStyles = (css: string, id: string): void => {
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = css;
  document.head.appendChild(style);
};
