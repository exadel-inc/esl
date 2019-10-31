import { ISmartPopupActionParams, SmartPopup } from '@components/smart-popup/smart-popup';
import Group from './smart-popup-manager.group';

const all: SmartPopup[] = [];

document.body.onclick = () => all.forEach((popup) => {
  popup.hide();
});

function uniqueId(prefix: any) {
  let idCounter = 0;
  const id = ++idCounter;
  return prefix.toString + id;
}

export default {
  groups: {},
  register(popup: any) {
    const { options: { group } } = popup;
    if (group) {
      this.groups[group] = this.groups[group] || new Group();
      this.groups[group].register(popup);
    }
    all.push(popup);
  },
  remove(popup: any) {
    const index = all.indexOf(popup);
    if (index < 0) return;
    all.splice(index, 1);
    const { options: { group } } = popup;
    if ((this.groups)[group]) {
      this.groups[group].remove(popup);
      if (!this.groups[group].size) {
        delete this.groups[group];
      }
    }
  },
  show(popup: any, params: ISmartPopupActionParams) {
    const { options: { group } } = popup;
    if (this.groups[group]) {
      this.groups[group].show(popup, params);
    } else {
      popup.show(params);
    }
  },
  bindTriggerAndTarget(trigger: any, target: any) {
    const uid = target.attr('id') || uniqueId('smart-popup-');
    trigger.attr('data-target-id', uid);
    target.attr('id', uid);
  }
};

