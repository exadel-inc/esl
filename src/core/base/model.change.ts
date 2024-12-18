import {overrideEvent} from '@exadel/esl/modules/esl-utils/dom';

import type {UIPPlugin} from './plugin';
import type {UIPRoot} from './root';
import type {UIPStateModel} from './model';
import type {UIPSource} from './source';

export type UIPModifier = UIPPlugin | UIPRoot | object;

export type UIPChangeInfo = {
  modifier: UIPModifier;
  type: UIPSource;
  force?: boolean;
};

export class UIPChangeEvent extends Event {
  public override readonly target: UIPRoot;

  public constructor(
    type: string,
    target: UIPRoot,
    public readonly changes: UIPChangeInfo[]
  ) {
    super(type, {bubbles: false, cancelable: false});
    overrideEvent(this, 'target', target);
  }

  public get model(): UIPStateModel {
    return this.target.model;
  }

  public get force(): boolean {
    return this.changes.some((change) => change.force);
  }

  public get jsChanges(): UIPChangeInfo[] {
    return this.changes.filter((change) => change.type === 'js');
  }

  public get htmlChanges(): UIPChangeInfo[] {
    return this.changes.filter((change) => change.type === 'html');
  }

  public isOnlyModifier(modifier: UIPModifier): boolean {
    return this.changes.every((change) => change.modifier === modifier);
  }
}
