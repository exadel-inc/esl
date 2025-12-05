import {attr, boolAttr, listen, memoize, prop} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLMixinElement} from '../../esl-mixin-element/core';

/**
 * ESLLineClampToggler mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampToggler is a custom attribute designed to work in pair with {@link ESLLineClamp}
 * Its purpose is provide toggle controls for switching between regular {@link ESLLineClamp} values and {@link ESLLineClampAlt} values.
 */
export class ESLLineClampToggler extends ESLMixinElement {
  static override is = 'esl-line-clamp-toggler';

  /** Custom event name to notify target about toggle */
  @prop('esl:clamp:toggle') public CLAMP_EVENT: string;
  /** Attribute to mark the target element as active */
  @prop('alt-active') public ALT_ACTIVE_ATTRIBUTE: string;
  /** Target selector for the element to control */
  @attr({name: ESLLineClampToggler.is, defaultValue: ''}) public target: string;
  /** Accessibility label for the toggler */
  @attr({defaultValue: ''}) public a11yLabel: string;
  /** Marker attribute to indicate active state */
  @boolAttr({name: 'toggler-active'}) public active: boolean;

  /** @returns the target element to control */
  @memoize()
  public get $target(): HTMLElement {
    return ESLTraversingQuery.first(this.target, this.$host) as HTMLElement || this.$host;
  }

  protected get isTargetActive(): boolean {
    return !!this.$target.hasAttribute(this.ALT_ACTIVE_ATTRIBUTE);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateState();
  }

  protected updateState(): void {
    this.initA11y();
    if (this.isTargetActive) this.active = true;
    if (this.active && !this.isTargetActive) this.toggle(true);
    this.updateA11y();
  }

  protected initA11y(): void {
    !this.$$attr('role') && this.$$attr('role', 'button');
    this.$$attr('aria-label', this.a11yLabel);
  }

  /** Updates accessibility attributes based on the current state */
  public updateA11y(): void {
    this.$$attr('aria-expanded', String(this.active));
  }

  protected toggle(value = !this.active): void {
    this.$target.toggleAttribute(this.ALT_ACTIVE_ATTRIBUTE, value);
    this.$target.dispatchEvent(new CustomEvent(this.CLAMP_EVENT));
  }

  @listen('click')
  protected onToggle(): void {
    this.toggle();
  }

  @listen({event: ESLLineClampToggler.prototype.CLAMP_EVENT, target: ($this: any) => $this.$target})
  protected onClampToggle(): void {
    this.active = this.isTargetActive;
    this.updateA11y();
  }
}
