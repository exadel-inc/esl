(function () {

  const event = KeyboardEvent.prototype;
  const desc = Object.getOwnPropertyDescriptor(event, 'key');
  if (!desc) return;

  const keys: Record<string, string> = {
    Win: 'Meta',
    Scroll: 'ScrollLock',
    Spacebar: ' ',

    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',

    Del: 'Delete',
    Apps: 'ContextMenu',
    Esc: 'Escape',

    Multiply: '*',
    Add: '+',
    Subtract: '-',
    Decimal: '.',
    Divide: '/',
  };

  Object.defineProperty(event, 'key', {
    get() {
      const key = desc.get!.call(this);
      return Object.prototype.hasOwnProperty.call(keys, key) ? keys[key] : key;
    },
  });
})();
