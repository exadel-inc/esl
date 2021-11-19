import {ready} from '../../all';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {ESLAnimateService} from './esl-animate-service';


export class ESLAnimate extends ESLBaseElement {
  static is = 'esl-animate';

  @attr({}) public group: number | false;
  @boolAttr({}) public repeat: boolean;

  static get observedAttributes() {
    return ['group', 'repeat'];
  }

  protected reanimate() {
    ESLAnimateService.observe(this, {repeat: this.repeat, group: this.group ? +this.group : false});
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

  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this);
  }
}
