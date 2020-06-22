import {SmartPopup, PopupActionParams} from './smart-popup';

export default class Group {
  protected popups = new Set<SmartPopup>();

  public register(popup: SmartPopup) {
    this.popups.add(popup);
  }

  public remove(popup: SmartPopup) {
    this.popups.delete(popup);
  }

  public hidePopups(popup: SmartPopup, params: PopupActionParams) {
    params.nextPopup = popup;
    this.popups.forEach((p: SmartPopup) => {
      if (popup !== p && p.open) {
          p.hide(params);
          params.previousPopup = p;
      }
    });
  }

  public get size() {
    return this.popups.size;
  }

  public get openedPopup() {
      for (const popup of this.popups) {
          if (popup.open) {
              return popup;
          }
      }
      return null;
  }
}
