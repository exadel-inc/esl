import SmartPopup from './smart-popup';
import Group from './smart-popup-manager-group';

const all = new Set<SmartPopup>();
const groups = new Map<string, Group>();

abstract class PopupManager {

    public static register(popup: SmartPopup, groupName?: string) {
        groupName = groupName || popup.group;
        if (groupName) {
            groups.get(groupName) || groups.set(groupName, new Group());
            groups.get(groupName).register(popup);
        }
        all.add(popup);
        PopupManager.updateCloseOnBodyClickHandler();
    }

    private static updateCloseOnBodyClickHandler() {
        if (all.size > 0) {
            document.addEventListener('click', PopupManager.closeOnBodyClickHandler);
        } else {
            document.removeEventListener('click', PopupManager.closeOnBodyClickHandler);
        }
    }

    private static closeOnBodyClickHandler() {
        all.forEach((popup) => {
            if (popup.closeOnBodyClick) {
                popup.hide();
            }
        });
    }

    public static remove(popup: SmartPopup, groupName?: string) {
        if (!all.has(popup)) {
            return;
        }
        all.delete(popup);
        PopupManager.updateCloseOnBodyClickHandler();
        groupName = groupName || popup.group;
        const group = groups.get(groupName);
        if (group) {
            group.remove(popup);
            if (!group.size) {
                groups.delete(groupName);
            }
        }
    }

    public static hidePopupsInGroup(popup: SmartPopup) {
        const groupName = popup.group;
        const group = groups.get(groupName);
        if (group) {
            group.hidePopups(popup);
        }
    }
}

export default PopupManager;
