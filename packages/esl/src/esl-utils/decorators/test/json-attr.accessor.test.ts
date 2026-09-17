import {jsonAttr} from '../json-attr';

describe('Decorator: jsonAttr (accessor class members)', () => {

  class TestElement extends HTMLElement {
    @jsonAttr({defaultValue: {a: 1}})
    public accessor jsonField: Record<string, unknown>;
  }

  customElements.define('test-el-json-attr-accessor', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('@jsonAttr on accessor member maps to the JSON attribute', () => {
    expect(el.jsonField).toEqual({a: 1});
    el.jsonField = {b: 2};
    expect(el.jsonField).toEqual({b: 2});
    expect(el.getAttribute('json-field')).toBe('{"b":2}');
  });
});
