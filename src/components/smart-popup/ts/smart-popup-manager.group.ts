import SmartPopup from './smart-popup';

export default class Group {
  protected popups: SmartPopup[] = [];

  protected register(popup: SmartPopup) {
    this.popups.push(popup);
  }

  protected remove(popup: SmartPopup) {
    const index = this.popups.indexOf(popup);
    (index >= 0) && this.popups.splice(index, 1);
  }

  protected hidePopups(popup: SmartPopup) {
    this.popups.forEach((p: SmartPopup) => {
      if (popup !== p) {
        p.hide();
      }
    });
  }

  get size() {
    return this.popups.length;
  }
}
