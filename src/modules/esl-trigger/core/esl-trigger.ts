import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLBaseTrigger} from '../../esl-base-trigger/core';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {ESLBasePopup} from '../../esl-base-popup/core/esl-base-popup';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseTrigger {
  public static is = 'esl-trigger';

  static get observedAttributes() {
    return ['target', 'event', 'mode'];
  }

  // Markers
  @boolAttr() public active: boolean;

  // Main setting
  @attr({defaultValue: 'next'}) public target: string;
  @attr({defaultValue: 'click'}) public event: string;
  @attr({defaultValue: 'toggle'}) public mode: string;

  // Common properties
  @attr() public showDelay: string;
  @attr() public hideDelay: string;
  @attr() public touchShowDelay: string;
  @attr() public touchHideDelay: string;

  protected attributeChangedCallback(attrName: string) {
    if (!this.connected) return;
    switch (attrName) {
      case 'target':
        this.updatePopupFromTarget();
        break;
      case 'mode':
      case 'event':
        this.unbindEvents();
        this.bindEvents();
        break;
    }
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.updatePopupFromTarget();
  }
  @ready
  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = TraversingQuery.first(this.target, this) as ESLBasePopup;
  }

  public get showEvent() {
    if (this.mode === 'hide') return null;
    if (this.event === 'hover') {
      return DeviceDetector.isTouchDevice ? 'click' : 'mouseenter';
    }
    return this.event;
  }
  public get hideEvent() {
    if (this.mode === 'show') return null;
    if (this.event === 'hover') {
      if (DeviceDetector.isTouchDevice) return 'click';
      return this.mode === 'hide' ? 'mouseenter' : 'mouseleave';
    }
    return this.event;
  }

  @bind
  protected _onHideEvent(e: Event) {
    this.popup.hide({
      activator: this,
      delay: this.hideDelayValue,
      trackHover: this.event === 'hover' && this.mode === 'toggle'
    });
  }

  protected get showDelayValue(): number | undefined {
    const showDelay = DeviceDetector.isTouchDevice ? this.touchShowDelay : this.showDelay;
    return !showDelay || isNaN(+showDelay) ? undefined : +showDelay;
  }
  protected get hideDelayValue(): number | undefined {
    const hideDelay = DeviceDetector.isTouchDevice ? this.touchHideDelay : this.hideDelay;
    return !hideDelay || isNaN(+hideDelay) ? undefined : +hideDelay;
  }
}
