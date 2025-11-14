import {attr, listen, memoize, ready, safe} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLMediaQuery, ESLMediaRuleList, ESLMixinElement, ESLTraversingQuery, parseBoolean} from '@exadel/esl';

export class ESLDemoClampControl extends ESLMixinElement {
  static override is = 'esl-d-clamp-control';

  @attr({name: 'hidden', parser: parseBoolean}) public hidden: boolean;

  @attr({name: ESLDemoClampControl.is, defaultValue: ''}) public query: string;

  @attr() public target: string;

  @attr() public a11yTarget: string;

  @memoize()
  get $target(): HTMLElement | undefined {
    if (this.target) return ESLTraversingQuery.first(this.target, this.$host) as HTMLElement | undefined;
  }

  @memoize()
  get $a11yTarget(): HTMLElement | undefined {
    if (this.a11yTarget) return ESLTraversingQuery.first(this.a11yTarget, this.$host) as HTMLElement | undefined;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.toggleClamp(!this.hidden);
  }

  @memoize()
  @safe(ESLMediaRuleList.empty<string>())
  public get linesQuery(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.query);
  }

  protected toggleClamp(clamp: boolean): void {
    this.$target?.setAttribute('esl-line-clamp', clamp ? this.linesQuery.value || '0' : '0');
  }

  @listen('click')
  protected onClick(): void {
    this.$a11yTarget?.focus();
    this.toggleClamp(false);
    this.hidden = true;
  }

  @listen({
    event: 'change',
    target: ($this: ESLDemoClampControl) => ESLMediaQuery.for($this.query)
  })
  protected onBreakpointChange(): void {
    if (this.hidden) return;
    this.toggleClamp(true);
  }
}
