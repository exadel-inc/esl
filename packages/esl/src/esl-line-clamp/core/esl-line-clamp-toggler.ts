import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLMixinElement} from '../../esl-mixin-element/core';

/**
 * ESLLineClampToggler mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampToggler is a mixin element designed to work in pair with {@link ESLLineClamp}
 * Its purpose is provide toggle controls for switching between regular {@link ESLLineClamp} values and {@link ESLLineClampAlt} values.
 */
export class ESLLineClampToggler extends ESLMixinElement {
  static override is = 'esl-line-clamp-toggler';

  public static readonly CLAMP_EVENT = 'esl:clamp:toggle';

  public static readonly togglerActive = 'toggler-active';

  public static readonly altActive = 'alt-active';

  @attr({name: ESLLineClampToggler.is, defaultValue: ''}) public target: string;

  @attr({defaultValue: 'Toggle alternative clamping'}) public a11yLabel: string;

  @boolAttr({name: ESLLineClampToggler.togglerActive}) public active: boolean;

  @memoize()
  public get $targetEl(): HTMLElement | undefined {
    if (!this.target) return;
    return ESLTraversingQuery.first(this.target, this.$host) as HTMLElement;
  }

  protected get isTargetActive(): boolean {
    return !!this.$targetEl?.hasAttribute(ESLLineClampToggler.altActive);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateState();
  }

  protected updateState(): void {
    this.initA11y();

    if (!this.$targetEl) this.active = false;
    if (this.isTargetActive) this.active = true;
    else if (this.active) this.onToggle();

    this.updateA11y();
  }

  protected initA11y(): void {
    if (!this.$targetEl) return;
    this.$$attr('role', 'button');
    this.$$attr('aria-label', this.a11yLabel);
  }

  public updateA11y(): void {
    this.$$attr('aria-expanded', String(!!this.$targetEl && this.active));
  }

  @listen('click')
  protected onToggle(): void {
    if (!this.$targetEl) return;
    this.active = !this.isTargetActive;
    this.$targetEl.toggleAttribute(ESLLineClampToggler.altActive, this.active);
    this.$targetEl.dispatchEvent(new CustomEvent(ESLLineClampToggler.CLAMP_EVENT));
  }

  @listen({event: ESLLineClampToggler.CLAMP_EVENT, target: ($this: any) => $this.$targetEl})
  protected onClampToggle(): void {
    this.active = this.isTargetActive;
    this.updateA11y();
  }
}
