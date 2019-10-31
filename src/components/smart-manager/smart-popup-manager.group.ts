import { ISmartPopupActionParams, SmartPopup } from '@components/smart-popup/smart-popup';

export default class Group {
  protected popups: object[] = [];

  protected register(popup: SmartPopup) {
    this.popups.push(popup);
  }

  protected remove(popup: SmartPopup) {
    const index = this.popups.indexOf(popup);
    (index >= 0) && this.popups.splice(index, 1);
  }

  protected show(popup: SmartPopup, params: ISmartPopupActionParams) {
    this.popups.forEach((p: SmartPopup) => p.hide());
    popup._show(params);
  }

  get size() {
    return this.popups.length;
  }
}
