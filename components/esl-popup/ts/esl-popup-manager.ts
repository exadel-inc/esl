import ESLPopup, {PopupActionParams} from './esl-popup';
import Group from './esl-popup-manager-group';

const groups = new Map<string, Group>();

abstract class PopupManager {

    public static registerInGroup(popup: ESLPopup, groupName?: string) {
        groupName = groupName || popup.group;
        if (groupName) {
            groups.get(groupName) || groups.set(groupName, new Group());
            groups.get(groupName).register(popup);
        }
    }

    public static removeFromGroup(popup: ESLPopup, groupName?: string) {
        groupName = groupName || popup.group;
        const group = groups.get(groupName);
        if (group) {
            group.remove(popup);
            if (!group.size) {
                groups.delete(groupName);
            }
        }
    }

    public static hidePopupsInGroup(popup: ESLPopup, params: PopupActionParams) {
        const groupName = popup.group;
        const group = groups.get(groupName);
        if (group) {
            group.hidePopups(popup, params);
        }
    }

    public static getOpenedPopupInGroup(groupName: string) {
        const group = groups.get(groupName);
        if (group) {
            return group.openedPopup;
        }
        return null;
    }
}

export default PopupManager;
