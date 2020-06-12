import SmartPopup, {PopupActionParams} from './smart-popup';

export default class Group {
  protected popups = new Set<SmartPopup>();

  public register(popup: SmartPopup) {
    this.popups.add(popup);
  }

  public remove(popup: SmartPopup) {
    this.popups.delete(popup);
  }

  public hidePopups(popup: SmartPopup, params: PopupActionParams): SmartPopup {
    params.nextPopup = popup;
    let previousPopup = null;
    params.previousPopup = null;
    this.popups.forEach((p: SmartPopup) => {
      if (popup !== p && p.open) {
          params.previousPopup = p;
          p.hide(params);
          previousPopup = p;
      }
    });
    return previousPopup;
  }

  public get size() {
    return this.popups.size;
  }

  public get openedPopup() {
      // @ts-ignore
      for (let popup of this.popups) {
          if (popup.open) {
              return popup;
          }
      }
      return null;
  }
}
