export function isRtl(el: HTMLElement) {
  const parent = el.closest('[dir]') as HTMLElement;
  return parent?.dir === 'rtl';
}