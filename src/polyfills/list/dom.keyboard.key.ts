/**
 * KeyboardEvent.prototype.key shim to normalize IE and Edge <= 18 key values to W3C spec
 * Based on published shim https://www.npmjs.com/package/shim-keyboard-event-key
 */
(function (KeyboardEventProto) {
  const desc = Object.getOwnPropertyDescriptor(KeyboardEventProto, 'key');
  if (!desc) return;

  const keyMap: Record<string, string> = {
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

  Object.defineProperty(KeyboardEventProto, 'key', {
    get() {
      const key = desc.get!.call(this);
      return Object.prototype.hasOwnProperty.call(keyMap, key) ? keyMap[key] : key;
    },
  });
})(KeyboardEvent.prototype);
