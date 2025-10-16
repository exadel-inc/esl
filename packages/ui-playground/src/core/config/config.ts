export abstract class UIPConfigurable {
  public static readonly configKey: keyof UIPDefaultConfig;
}

export interface UIPDefaultConfig {
  root: {
    themeCls?: string;
  };
  editor: {
    label?: string;
    copy?: boolean;
    collapsible?: boolean;
    resizable?: boolean;
  };

  settings: {
    label?: string;
    dirToggle?: boolean;
    themeToggle?: boolean;
    collapsible?: boolean;
    resizable?: boolean;
    hideable?: boolean;
  };
}

export class UIPDefaults {
  protected static defaultConfigs: Partial<UIPDefaultConfig> = {};

  public static applyDefaults(config?: Partial<UIPDefaultConfig>): void {
    Object.assign(this.defaultConfigs, config);
  }

  public static for<T extends UIPConfigurable>(target: T): Record<string, any> {
    return this.defaultConfigs[(target.constructor as typeof UIPConfigurable).configKey] ?? {};
  }
}
