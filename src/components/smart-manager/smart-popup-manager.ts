import { ISmartPopupActionParams, SmartPopup } from '@components/smart-popup/smart-popup';
import Group from './smart-popup-manager.group';

const all: SmartPopup[] = [];

// document.body.onclick = () => all.forEach((popup) => {
//   popup.hide();
// });

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
  hidePopupsInGroup(popup: any) {
    const { options: { group } } = popup;
    if (this.groups[group]) {
      this.groups[group].hidePopups();
    }
  }
};

