export interface UIPDefaultConfig {
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

  public static for<T extends {readonly configKey: keyof UIPDefaultConfig}>(target: T): Partial<UIPDefaultConfig[T['configKey']]> {
    return this.defaultConfigs[target.configKey] ?? {};
  }
}
