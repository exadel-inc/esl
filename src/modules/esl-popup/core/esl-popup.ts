import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/core';
import {ESLToggleable} from '../../esl-toggleable/core';
import {ScrollUtils} from '../../esl-utils/dom/scroll';

import type {ScrollStrategy} from '../../esl-utils/dom/scroll';
import type {ToggleableActionParams} from '../../esl-toggleable/core';

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static is = 'esl-popup';

  @attr({defaultValue: null}) public disableScroll: ScrollStrategy;

  protected onShow(params: ToggleableActionParams) {
    super.onShow(params);

    this.disableScroll !== null && ScrollUtils.requestLock(this, this.disableScroll);
  }

  protected onHide(params: ToggleableActionParams) {
    super.onHide(params);

    this.disableScroll !== null && ScrollUtils.requestUnlock(this, this.disableScroll);
  }
}
