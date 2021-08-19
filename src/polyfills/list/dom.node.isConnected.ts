/**
 * Group: DOM polyfills
 * Target browsers: `IE11`, `Edge <= 18`
 * Node.isConnected polyfill
 */
if (!('isConnected' in Node.prototype)) {
  Object.defineProperty(Node.prototype, 'isConnected', {
    get() {
      return !this.ownerDocument ||
        // eslint-disable-next-line no-bitwise
        !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
    }
  });
}
