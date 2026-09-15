import {attr} from '../attr';
import {boolAttr} from '../bool-attr';
import {jsonAttr} from '../json-attr';
import {prop} from '../prop';

class AccessorTypesTest extends HTMLElement {
  @attr()
  public accessor attrAccessor: string;
  @attr({defaultValue: 'def'})
  public accessor attrAccessorDef: string;
  @attr({readonly: true})
  public accessor attrAccessorReadonly: string | null;

  @boolAttr()
  public accessor boolAccessor: boolean;

  @jsonAttr()
  public accessor jsonAccessor: Record<string, unknown>;

  @prop('value')
  public accessor propAccessor: string;

  // Plain fields keep working as before
  @attr()
  public attrField: string;
  @boolAttr()
  public boolField: boolean;
  @jsonAttr()
  public jsonField: Record<string, unknown>;
  @prop('value')
  public propField: string;
}
