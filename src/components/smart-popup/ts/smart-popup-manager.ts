import SmartPopup from './smart-popup';
import Group from './smart-popup-manager-group';

const all: SmartPopup[] = [];

document.addEventListener('click', () => {
  all.forEach((popup) => {
    if (popup.closeOnBodyClick) {
      popup.hide();
    }
  });
});

export default {
  groups: {},
  register(popup: SmartPopup) {
    const group = popup.group;
    if (group) {
      this.groups[group] = this.groups[group] || new Group();
      this.groups[group].register(popup);
    }
    all.push(popup);
  },
  remove(popup: SmartPopup) {
    const index = all.indexOf(popup);
    if (index < 0) return;
    all.splice(index, 1);
    const group = popup.group;
    if ((this.groups)[group]) {
      this.groups[group].remove(popup);
      if (!this.groups[group].size) {
        delete this.groups[group];
      }
    }
  },
  hidePopupsInGroup(popup: SmartPopup) {
    const group = popup.group;
    if (this.groups[group]) {
      this.groups[group].hidePopups(popup);
    }
  }
};

