/**
 * Execute callback in bounds of the next task with dom ready state precondition
 */
export function onDocumentReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function fn() {
      document.removeEventListener('DOMContentLoaded', fn);
      setTimeout(() => callback());
    });
  } else {
    setTimeout(() => callback());
  }
}
