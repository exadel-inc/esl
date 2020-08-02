import {ESLBasePopup, PopupActionParams} from './esl-base-popup';

const groups = new Map<string, ESLBasePopupGroup>();

export class ESLBasePopupGroup {
	protected popups = new Set<ESLBasePopup>();

	/**
	 * Add popup to group
	 */
	public add(popup: ESLBasePopup) {
		this.popups.add(popup);
		return this;
	}

	/**
	 * Remove popup from group
	 */
	public remove(popup: ESLBasePopup) {
		this.popups.delete(popup);
		return this;
	}

	/**
	 * Hide all popup in group except passed active one
	 */
	public activate(popup: ESLBasePopup, params: PopupActionParams) {
		params.nextPopup = popup;
		params.previousPopup = this.active;
		if (params.previousPopup && params.nextPopup !== params.previousPopup) {
			params.previousPopup.hide(params);
		}
		return this;
	}

	/**
	 * Returns size of the group
	 */
	public get size() {
		return this.popups.size;
	}

	/**
	 * Get active popup in group
	 */
	public get active() {
		let active: ESLBasePopup = null;
		// Symbols & Iterators are not required by minimum environment preconditions
		this.popups.forEach((popup) => {
			active = (!active && popup.open) ? popup : active;
		});
		return active;
	}


	/**
	 * Get dummy unregistered group for popup
	 */
	public static empty() {
		return new ESLBasePopupGroup();
	}

	/**
	 * Find group by name
	 */
	public static find(name: string) {
		const group = name ? groups.get(name) : null;
		return group || this.empty();
	}

	/**
	 * Register popup in group
	 */
	public static register(popup: ESLBasePopup, groupName: string = popup.groupName) {
		if (!groupName) return;
		groups.set(groupName, this.find(groupName).add(popup));
	}

	/**
	 * Unregister popup from group
	 */
	public static unregister(popup: ESLBasePopup, groupName: string = popup.groupName) {
		if (!groupName) return;
		const group = this.find(groupName).remove(popup);
		if (!group.size) {
			groups.delete(groupName);
		}
	}
}
