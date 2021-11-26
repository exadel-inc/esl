import {memoize, ready, TraversingQuery} from '../../all';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';

import {ESLAnimateService} from './esl-animate-service';

export class ESLAnimate extends ESLBaseElement {
  static is = 'esl-animate';

  @attr({defaultValue: 'in'}) public cls: string;
  @attr({defaultValue: '-1'}) public group: string;
  @attr() public target: string;

  @boolAttr() public repeat: boolean;

  static get observedAttributes() {
    return ['group', 'repeat', 'target'];
  }

  @memoize()
  public get $targets() {
    return TraversingQuery.all(this.target, this);
  }

  protected attributeChangedCallback() {
    if (!this.connected) return;
    this.reanimate();
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$targets);
  }

  protected reanimate() {
    ESLAnimateService.unobserve(this.$targets);
    memoize.clear(this, '$targets');
    ESLAnimateService.observe(this.$targets, {
      cls: this.cls,
      repeat: this.repeat,
      group: +(this.group || '100')
    });
  }
}
