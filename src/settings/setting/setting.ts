import {attr, ESLBaseElement} from "@exadel/esl/modules/esl-base-element/core";
import {UIPStateModel} from "../../utils/state-model/state-model";

export abstract class UIPSetting extends ESLBaseElement {
  @attr() attribute: string;
  @attr() label?: string;
  @attr() target?: string;

  public applyTo(model: UIPStateModel): void {

  }

  public updateFrom(model: UIPStateModel): void {

  }

  abstract getValue(): string | boolean | null;
  abstract isValid(): void;
  abstract setInconsistency(): void;
  abstract setDisplayedValue(): void;
}
