import {Observable} from '../../../esl-utils/abstract/observable';

export class ESLSelectModel extends Observable {
  private readonly _options: Map<string, HTMLOptionElement>;

  constructor(options: HTMLOptionElement[]) {
    super();
    this._options = new Map<string, HTMLOptionElement>();
    options.forEach((opt) => {
      this._options.set(opt.value, opt);
    });
  }

  public get options(): HTMLOptionElement[] {
    const options: HTMLOptionElement[] = [];
    this._options.forEach((opt) => options.push(opt));
    return options;
  }
  public get selected(): HTMLOptionElement[] {
    const options: HTMLOptionElement[] = [];
    this._options.forEach((opt) => opt.selected && options.push(opt));
    return options;
  }

  public get fill() {
    return this.options.some((item) => item.selected);
  }

  public get(val: string) {
    return this._options.get(val);
  }
  public check(value: string): boolean {
    const opt = this.get(value);
    return !!opt && opt.selected;
  }
  public toggle(value: string, select: boolean) {
    const opt = this.get(value);
    opt && (opt.selected = select);
    this.fire();
  }
  public toggleAll(select: boolean) {
    this._options.forEach((item) => {
      item.selected = select;
    });
    this.fire();
  }
}
