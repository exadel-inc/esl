export function isRtl(el: HTMLElement) {
  const parent = el.closest('[dir]') as HTMLElement;
  return parent?.dir === 'rtl';
}

let rtlNegativeScroll: boolean | undefined;
export function isNegativeScroll() {
  if (typeof rtlNegativeScroll !== 'boolean') {
    const definer = document.createElement('div');
    definer.dir = 'rtl';
    definer.setAttribute('style', 'width: 1px; height: 1px; position: fixed; top: 0px; left: 0px; overflow: hidden');
    definer.innerHTML = '<div style="width: 2px"></div>';
    document.body.appendChild(definer);
    definer.scrollLeft = -1;
    rtlNegativeScroll = definer.scrollLeft < 0;
    document.body.removeChild(definer);
  }
  return rtlNegativeScroll;
}