import {ESLTraversingQuery} from '../../../src/modules/esl-traversing-query/core';
import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {attr, listen} from '../../../src/modules/esl-utils/decorators';

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
  public static ACTIONS_ALL = Object.keys(ESLDemoMediaControls.ACTIONS).join(',');

  @attr() public target: string;
  @attr({defaultValue: ESLDemoMediaControls.ACTIONS_ALL}) public actions: string;

  public get $targets(): HTMLElement[] {
    return ESLTraversingQuery.all(this.target, this) as HTMLElement[];
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.render();
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

  @listen('click')
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
