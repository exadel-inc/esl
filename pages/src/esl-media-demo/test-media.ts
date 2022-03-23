import {bind} from '../../../src/modules/esl-utils/decorators/bind';
import {TraversingQuery} from '../../../src/modules/esl-traversing-query/core';
import {attr, ESLBaseElement} from '../../../src/modules/esl-base-element/core';

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

class ESLDemoMediaControls extends ESLBaseElement {
  public static is = 'esl-d-media-controls';

  public static ACTIONS: {[key: string]: TestMediaAction} = {
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
  public static ACTIONS_ALL = Object.keys(ESLDemoMediaControls.ACTIONS).join(',');

  @attr() public target: string;
  @attr({defaultValue: ESLDemoMediaControls.ACTIONS_ALL}) public actions: string;

  public get $targets(): HTMLElement[] {
    return TraversingQuery.all(this.target, this) as HTMLElement[];
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.render();
    this.addEventListener('click', this.onClick);
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
  }

  private render(): void {
    const actionList = this.actions.split(',');

    this.innerHTML = '';
    for (const actionName of actionList) {
      const action: TestMediaAction = ESLDemoMediaControls.ACTIONS[actionName];
      if (!action) return;
      this.appendChild(action.render(actionName, action));
    }
  }

  @bind
  private onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const actionName = target.dataset.action;
    if (actionName && ESLDemoMediaControls.ACTIONS[actionName]) {
      const actionDesc = ESLDemoMediaControls.ACTIONS[actionName];
      const actionFn = actionDesc.action;
      this.$targets.forEach(($el) => actionFn.call($el, $el, actionName, actionDesc));
    }
  }
}

function renderButton(actionName: string, action: TestMediaAction): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'btn btn-sec-blue';
  btn.dataset.action = actionName;
  btn.textContent = action.title;
  return btn;
}

ESLDemoMediaControls.register();
