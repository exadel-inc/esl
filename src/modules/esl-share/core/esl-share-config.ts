import defaultConfig from '../config/default.json';

/** {@link ESLShareConfigShape} provider type definition */
export type ESLShareConfigProviderType = () => Promise<ESLShareConfigShape>;

/** The definition of the sharing button */
export interface ESLShareButtonConfig {
  /** Name of the share action, which is performed after the button is pressed */
  action: string;
  /** HTML content of the share icon */
  icon: string;
  /** Color of the icon background (the value - CSS data type represents a color) */
  iconBackground: string;
  /**
   * URL link (with placeholders) to share. Can contain the following placeholders:
   * - `{u}` or `{url}` - URL to share (`shareUrl` property on the {@link ESLShareButton} instance)
   * - `{t}` or `{title}` - title to share (`shareTitle` property on the {@link ESLShareButton} instance)
   */
  link: string;
  /** String identifier of the button (no spaces) */
  name: string;
  /** Button title */
  title: string;
  /** Additional params to pass into a button */
  additional?: Record<string, any>;
}

/** The definition of share buttons groups (named sets of share buttons) */
export interface ESLShareGroupConfig {
  /** Name of the group. The group can be accessed with the `group:` prefix in the component configuration */
  name: string;
  /** A list of button names separated by space */
  list: string;
}

/** The definition of `ESLShare` component configuration */
export interface ESLShareConfigShape {
  /** List of sharing buttons configuration */
  buttons: ESLShareButtonConfig[];
  /** List of share button groups configurations */
  groups: ESLShareGroupConfig[];
}

/** Gets item of the section by name */
function getConfigSectionItem<T extends ESLShareButtonConfig | ESLShareGroupConfig>(section: T[], name: string): T | undefined {
  return section.find((item) => item.name === name);
}

/** Class for managing share buttons configurations */
export class ESLShareConfig {
  protected static _config: Promise<ESLShareConfig> = Promise.resolve(ESLShareConfig._from(defaultConfig));

  /**
   * Creates `ESLShareConfig` instance from the passed object with share component configuration
   * @returns config instance
   */
  protected static _from(cfg: ESLShareConfigShape): ESLShareConfig {
    return new ESLShareConfig(cfg);
  }

  /**
   * Gets promise with buttons config instance.
   * @returns Promise of the current config instance
   */
  public static get(): Promise<ESLShareConfig> {
    return ESLShareConfig._config;
  }

  /**
   * Sets config with a promise of a new config object or using a config provider function.
   * @returns Promise of the current config
   */
  public static set(provider?: ESLShareConfigProviderType | ESLShareConfigShape): Promise<ESLShareConfig> {
    if (typeof provider === 'function') ESLShareConfig._config = provider().then(ESLShareConfig._from);
    if (typeof provider === 'object') ESLShareConfig._config = Promise.resolve(ESLShareConfig._from(provider));
    return ESLShareConfig.get();
  }

  public constructor(protected _config: ESLShareConfigShape) {}

  /** @returns config of buttons */
  public get buttons(): ESLShareButtonConfig[] {
    return this._config.buttons;
  }

  /** @returns config of groups */
  public get group(): ESLShareGroupConfig[] {
    return this._config.groups;
  }

  /**
   * Selects the buttons for the given list and returns their configuration.
   * @returns config of buttons
   */
  public getList(list: string): ESLShareButtonConfig[] {
    return list.split(' ').reduce((res, item) => {
      const [btnName, groupName] = item.split('group:');
      if (groupName) {
        const groupConfig = this.getGroup(groupName);
        if (groupConfig) return res.concat(this.getList(groupConfig.list));
      } else {
        const btnConfig = this.getButton(btnName);
        if (btnConfig) res.push(btnConfig);
      }
      return res;
    }, [] as ESLShareButtonConfig[]);
  }

  /**
   * Gets the group of buttons configuration.
   * @returns config of group
   */
  public getGroup(groupName: string): ESLShareGroupConfig | undefined {
    return getConfigSectionItem(this._config.groups, groupName);
  }

  /**
   * Gets the button configuration.
   * @returns config of button
   */
  public getButton(name: string): ESLShareButtonConfig | undefined {
    return getConfigSectionItem(this._config.buttons, name);
  }
}
