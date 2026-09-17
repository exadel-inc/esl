import {prop} from '../prop';

describe('Decorator: prop (accessor class members)', () => {

  class TestElement extends HTMLElement {
    @prop('prop-value')
    public accessor propField: string;
    @prop(() => 'propProvided')
    public accessor propProvided: string;
    @prop(() => 'propRo', {readonly: true})
    public accessor propReadonly: string;
  }

  customElements.define('test-el-prop-accessor', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('@prop on accessor member defines a static value overriding the auto-accessor', () => {
    expect(el.propField).toBe('prop-value');
    el.propField = 'changed';
    expect(el.propField).toBe('changed');
  });

  test('@prop provider on accessor member resolves value through the provider', () => {
    expect(el.propProvided).toBe('propProvided');
  });

  test('@prop readonly provider on accessor member ignores writes', () => {
    expect(el.propReadonly).toBe('propRo');
    el.propReadonly = 'changed';
    expect(el.propReadonly).toBe('propRo');
  });

  test('@prop on a non-accessor own property throws', () => {
    class Base {
      public field(): void {}
    }
    expect(() => prop('value')(Base.prototype, 'field')).toThrow(TypeError);
    expect(() => prop('value')(Base.prototype, 'field')).toThrow('Can\'t override own property');
  });
});
