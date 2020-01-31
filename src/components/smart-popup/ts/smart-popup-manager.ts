import SmartPopup from './smart-popup';
import Group from './smart-popup-manager-group';

const allPopups = new Set<SmartPopup>();
const groups = new Map<string, Group>();
let hasCloseOnBodyClickHandler = false;

abstract class PopupManager {

    public static register(popup: SmartPopup, groupName?: string) {
        groupName = groupName || popup.group;
        if (groupName) {
            groups.get(groupName) || groups.set(groupName, new Group());
            groups.get(groupName).register(popup);
        }
        allPopups.add(popup);
        PopupManager.updateCloseOnBodyClickHandler();
    }

    private static updateCloseOnBodyClickHandler() {
        if (allPopups.size > 0 && !hasCloseOnBodyClickHandler) {
            document.addEventListener('click', PopupManager.closeOnBodyClickHandler);
            hasCloseOnBodyClickHandler = true;
        } else {
            document.removeEventListener('click', PopupManager.closeOnBodyClickHandler);
            hasCloseOnBodyClickHandler = false;
        }
    }

    private static closeOnBodyClickHandler() {
        allPopups.forEach((popup) => {
            if (popup.closeOnBodyClick) {
                popup.hide();
            }
        });
    }

    public static remove(popup: SmartPopup, groupName?: string) {
        if (!allPopups.has(popup)) {
            return;
        }
        allPopups.delete(popup);
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
