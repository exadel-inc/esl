
interface MediaTarget {
	play(): any;
	pause(): any;
	stop(): any;
}
interface TestMediaAction {
	title: string;
	action: (target: MediaTarget) => void;
}
class TestMediaControls extends HTMLElement {

	public static ACTIONS: {[key: string]: TestMediaAction} = {
		play: {
			title: 'Play',
			action: (target: any) => target.play()
		},
		pause: {
			title: 'Pause',
			action: (target: any) => target.pause()
		},
		stop: {
			title: 'Stop',
			action: (target: any) => target.stop()
		}
	};
	public static ACTIONS_ALL = Object.keys(TestMediaControls.ACTIONS).join(',');

	get target() {
		const targetSel = this.getAttribute('target');
		return targetSel ? Array.from(document.querySelectorAll(targetSel)) : [];
	}

	get actions() {
		return this.getAttribute('actions') || TestMediaControls.ACTIONS_ALL;
	}

	private render() {
		const actionList = this.actions.split(',');

		this.innerHTML = '';
		for (const actionName of actionList) {
			const action: TestMediaAction = TestMediaControls.ACTIONS[actionName];
			if (!action) return;

			const btn = document.createElement('button');
			btn.className = 'btn btn-primary';
			btn.dataset.action = actionName;
			btn.textContent = action.title;

			this.appendChild(btn);
		}
	}

	private onClick(e: Event) {
		const target = e.target as HTMLElement;
		const actionName = target.dataset.action;
		if (actionName && TestMediaControls.ACTIONS[actionName]) {
			const actionFn = TestMediaControls.ACTIONS[actionName].action;
			this.target.forEach(($el) => actionFn.call($el, $el));
		}
	}

	protected connectedCallback() {
		this.render();
		this.addEventListener('click', this.onClick.bind(this));
	}
}

customElements.define('test-media-controls', TestMediaControls);