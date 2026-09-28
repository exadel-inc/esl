import {boolAttr} from '../bool-attr';

describe('Decorator: boolAttr (accessor class members)', () => {

  class TestElement extends HTMLElement {
    @boolAttr()
    public accessor boolField: boolean;
  }

  customElements.define('test-el-bool-attr-accessor', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('@boolAttr on accessor member maps to the marker attribute', () => {
    expect(el.boolField).toBe(false);
    el.boolField = true;
    expect(el.boolField).toBe(true);
    expect(el.hasAttribute('bool-field')).toBe(true);
    el.boolField = false;
    expect(el.boolField).toBe(false);
    expect(el.hasAttribute('bool-field')).toBe(false);
  });
});
