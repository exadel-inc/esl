import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLLineClampAlt} from './esl-line-clamp-alt';

/**
 * ESLLineClampToggler mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampToggler is a mixin element designed to work in pair with {@link ESLLineClampAlt}
 * Its purpose is provide toggle controls for switching between regular {@link ESLLineClamp} values and {@link ESLLineClampAlt} values.
 */
export class ESLLineClampToggler extends ESLMixinElement {
  static override is = 'esl-line-clamp-toggler';

  public static readonly activeAttr = 'toggler-active';

  @attr({name: ESLLineClampToggler.is, defaultValue: ''}) public target: string;

  @attr() public a11yTarget: string;

  @boolAttr({name: ESLLineClampToggler.activeAttr, readonly: true}) public togglerActive: boolean;

  @memoize()
  public get $targetEl(): HTMLElement | undefined {
    if (this.target) return ESLTraversingQuery.first(this.target, this.$host) as HTMLElement | undefined;
  }

  @memoize()
  public get $targetMixin(): ESLLineClampAlt | null | undefined {
    if (this.$targetEl) return ESLLineClampAlt.get(this.$targetEl);
  }

  @memoize()
  public get $a11yTarget(): HTMLElement | undefined {
    if (this.a11yTarget) return ESLTraversingQuery.first(this.a11yTarget, this.$host) as HTMLElement | undefined;
  }

  protected set _active(value: boolean) {
    this.$$attr(ESLLineClampToggler.activeAttr, value);
  }

  protected get isTargetActive(): boolean {
    return !!this.$targetEl?.hasAttribute(ESLLineClampAlt.activeAttr);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.$targetEl) this._active = false;
    if (this.isTargetActive) this._active = true;
    else if (this.togglerActive) this.$targetMixin?.toggle();
  }

  @listen('click')
  protected onClick(): void {
    this.$a11yTarget?.focus();
    this.$targetMixin?.toggle();
  }

  @listen({event: ESLLineClampAlt.CLAMP_EVENT, target: ($this: any) => $this.$targetEl})
  protected onClampToggled(): void {
    this._active = !this.isTargetActive;
  }
}
