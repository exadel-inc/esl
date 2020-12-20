import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/core';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/core';
import {ScrollStrategy, ScrollUtility} from '../../esl-utils/dom/scroll';

@ExportNs('Popup')
export class ESLPopup extends ESLBasePopup {
  public static is = 'esl-popup';
  public static eventNs = 'esl:popup';

  @attr({defaultValue: null}) public disableScroll: ScrollStrategy;

  protected onShow(params: PopupActionParams) {
    super.onShow(params);

    this.disableScroll !== null && ScrollUtility.requestLock(this, this.disableScroll);
  }

  protected onHide(params: PopupActionParams) {
    super.onHide(params);

    this.disableScroll !== null && ScrollUtility.requestUnlock(this, this.disableScroll);
  }
}

export default ESLPopup;
