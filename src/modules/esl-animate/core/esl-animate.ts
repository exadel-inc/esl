import {ready} from '../../all';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {ESLAnimateService} from './esl-animate-service';


export class ESLAnimate extends ESLBaseElement {
  static is = 'esl-animate';

  @attr({}) public group: number | false;
  @boolAttr({}) public repeat: boolean;

  @ready
  connectedCallback() {
    super.connectedCallback();
    ESLAnimateService.observe(this, {repeat: this.repeat, group: this.group ? +this.group : false});
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this);
  }
}
