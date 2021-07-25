export class ESLMediaStaticShortcut {
  public constructor(
    public readonly name: string,
    public readonly replacement: string | boolean
  ) {}

  public replacer(match: string) {
    return match === this.name ? this.replacement : undefined;
  }

  public toString() {
    return this.name + ' -> ' + this.replacement;
  }
}
