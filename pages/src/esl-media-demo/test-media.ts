interface MediaTarget {
  play(): any;
  pause(): any;
  stop(): any;
}

interface TestMediaAction {
  title: string;
  action: (target: MediaTarget, actionName: string, action: TestMediaAction) => void;
  render: (actionName: string, action: TestMediaAction) => HTMLElement;
}

class TestMediaControls extends HTMLElement {

  public static ACTIONS: Record<string, TestMediaAction> = {
    play: {
      title: 'Play',
      action: (target: any) => target.play(),
      render: renderButton
    },
    pause: {
      title: 'Pause',
      action: (target: any) => target.pause(),
      render: renderButton
    },
    stop: {
      title: 'Stop',
      action: (target: any) => target.stop(),
      render: renderButton
    }
  };
  public static ACTIONS_ALL = Object.keys(TestMediaControls.ACTIONS).join(',');

  get target(): HTMLElement[] {
    const targetSel = this.getAttribute('target');
    return targetSel ? Array.from(document.querySelectorAll(targetSel)) : [];
  }

  get actions(): string {
    return this.getAttribute('actions') || TestMediaControls.ACTIONS_ALL;
  }

  private render(): void {
    const actionList = this.actions.split(',');

    this.innerHTML = '';
    for (const actionName of actionList) {
      const action: TestMediaAction = TestMediaControls.ACTIONS[actionName];
      if (!action) return;
      this.appendChild(action.render(actionName, action));
    }
  }

  private onClick(e: Event): void {
    const target = e.target as HTMLElement;
    const actionName = target.dataset.action;
    if (actionName && TestMediaControls.ACTIONS[actionName]) {
      const actionDesc = TestMediaControls.ACTIONS[actionName];
      const actionFn = actionDesc.action;
      this.target.forEach(($el) => actionFn.call($el, $el, actionName, actionDesc));
    }
  }

  protected connectedCallback(): void {
    this.render();
    this.addEventListener('click', this.onClick.bind(this));
  }
}

function renderButton(actionName: string, action: TestMediaAction): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'btn btn-sec-blue';
  btn.dataset.action = actionName;
  btn.textContent = action.title;
  return btn;
}

customElements.define('test-media-controls', TestMediaControls);
