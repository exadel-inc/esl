import SmartPopup from './smart-popup';
import Group from './smart-popup-manager-group';

const closeOnBodyClickPopups = new Set<SmartPopup>();
const groups = new Map<string, Group>();
let hasCloseOnBodyClickHandler = false;

abstract class PopupManager {

    public static registerInGroup(popup: SmartPopup, groupName?: string) {
        groupName = groupName || popup.group;
        if (groupName) {
            groups.get(groupName) || groups.set(groupName, new Group());
            groups.get(groupName).register(popup);
        }
    }

    public static removeFromGroup(popup: SmartPopup, groupName?: string) {
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

    public static registerCloseOnBodyClickPopup(popup: SmartPopup) {
        if (popup.closeOnBodyClick) {
            closeOnBodyClickPopups.add(popup);
            PopupManager.updateCloseOnBodyClickHandler();
        }
    }

    public static removeCloseOnBodyClickPopup(popup: SmartPopup) {
        closeOnBodyClickPopups.delete(popup);
        PopupManager.updateCloseOnBodyClickHandler();
    }

    private static updateCloseOnBodyClickHandler() {
        if (closeOnBodyClickPopups.size > 0) {
            if (!hasCloseOnBodyClickHandler) {
                document.addEventListener('click', PopupManager.closeOnBodyClickHandler);
                hasCloseOnBodyClickHandler = true;
            }
        } else {
            if (hasCloseOnBodyClickHandler) {
                document.removeEventListener('click', PopupManager.closeOnBodyClickHandler);
                hasCloseOnBodyClickHandler = false;
            }
        }
    }

    private static closeOnBodyClickHandler() {
        closeOnBodyClickPopups.forEach((popup) => popup.hide());
    }
}

export default PopupManager;
