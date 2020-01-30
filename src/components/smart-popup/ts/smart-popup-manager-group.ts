import SmartPopup from './smart-popup';

export default class Group {
  protected popups = new Set<SmartPopup>();

  public register(popup: SmartPopup) {
    this.popups.add(popup);
  }

  public remove(popup: SmartPopup) {
    this.popups.delete(popup);
  }

  public hidePopups(popup: SmartPopup) {
    this.popups.forEach((p: SmartPopup) => {
      if (popup !== p) {
        p.hide();
      }
    });
  }

  get size() {
    return this.popups.size;
  }
}
