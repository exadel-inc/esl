import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/core';
import {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core';
import {ScrollStrategy, ScrollUtility} from '../../esl-utils/dom/scroll';

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static is = 'esl-popup';

  @attr({defaultValue: null}) public disableScroll: ScrollStrategy;

  protected onShow(params: ToggleableActionParams) {
    super.onShow(params);

    this.disableScroll !== null && ScrollUtility.requestLock(this, this.disableScroll);
  }

  protected onHide(params: ToggleableActionParams) {
    super.onHide(params);

    this.disableScroll !== null && ScrollUtility.requestUnlock(this, this.disableScroll);
  }
}

export default ESLPopup;
