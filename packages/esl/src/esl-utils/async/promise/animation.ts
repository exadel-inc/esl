/** Utility to promisify transition observation */
export function promisifyTransition(
  $el: Element,
  props?: string
): Promise<void> {
  return new Promise((resolve) => {
    function transitionCallback(e: TransitionEvent): void {
      if (e.target !== $el) return;
      if (typeof props === 'string' && props !== e.propertyName) return;
      $el.removeEventListener('transitionend', transitionCallback);
      $el.removeEventListener('transitioncancel', transitionCallback);
      resolve();
    }
    $el.addEventListener('transitionend', transitionCallback);
    $el.addEventListener('transitioncancel', transitionCallback);
  });
}
