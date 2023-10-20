import {decorate, memoize} from '../../esl-utils/decorators';
import {microtask} from '../../esl-utils/async/microtask';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';

/** {@link ESLShareConfig} provider type definition */
export type ESLShareConfigProviderType = () => Promise<ESLShareConfig>;

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

/** Gets item of the section by name */
function getConfigSectionItem<T extends ESLShareButtonConfig | ESLShareGroupConfig>(section: T[], name: string): T | undefined {
  return section.find((item) => item.name === name);
}

/** Inserts item into section or updates if exists */
function setConfigSectionItem<T extends ESLShareButtonConfig | ESLShareGroupConfig>(section: T[], item: T): void {
  const index = section.findIndex((i) => i.name === item.name);
  if (index >= 0) section[index] = item;
  else section.push(item);
}

/** Class for managing share buttons configurations */
export class ESLShareConfig extends SyntheticEventTarget {
  @memoize()
  public static get instance(): ESLShareConfig {
    return new ESLShareConfig();
  }

  /**
   * Gets the button configuration.
   * @returns config of button
   */
  public static getButton(name: string): ESLShareButtonConfig | undefined {
    return ESLShareConfig.instance.getButton(name);
  }

  /**
   * Selects the buttons for the given list and returns their configuration.
   * @returns config of buttons
   */
  public static getList(list: string): ESLShareButtonConfig[] {
    return ESLShareConfig.instance.getList(list);
  }

  /**
   * Updates the configuration with either a new config object or by using a configuration provider function.
   * Every button and group specified in the new config will be added to the current configuration.
   * @returns ESLShareConfig instance
   */
  public static set(
    provider?: ESLShareConfigProviderType | Promise<Partial<ESLShareConfig>> | Partial<ESLShareConfig>
  ): ESLShareConfig {
    const {instance} = ESLShareConfig;
    if (typeof provider === 'function') return this.set(provider());
    if (typeof provider === 'object' && provider instanceof Promise) {
      provider.then((cfg) => this.set(cfg));
      return instance;
    }
    if (typeof provider === 'object') {
      if (provider?.groups) provider.groups.forEach(instance.appendGroup, instance);
      if (provider?.buttons) provider.buttons.forEach(instance.appendButton, instance);
    }
    return instance;
  }

  public readonly buttons: ESLShareButtonConfig[] = [];
  public readonly groups: ESLShareGroupConfig[] = [];

  protected constructor() {
    super();
  }

  /**
   * Selects the buttons for the given list and returns their configuration.
   * @returns config of buttons
   */
  public getList(list: string): ESLShareButtonConfig[] {
    if (list === 'all') return this.buttons;
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
    return getConfigSectionItem(this.groups, groupName);
  }

  /**
   * Gets the button configuration.
   * @returns config of button
   */
  public getButton(name: string): ESLShareButtonConfig | undefined {
    return getConfigSectionItem(this.buttons, name);
  }

  /**
   * Appends a button (inserts or updates) to the current config.
   * @returns config instance
   */
  public appendButton(button: ESLShareButtonConfig): ESLShareConfig {
    setConfigSectionItem(this.buttons, button);
    this._onUpdate();
    return this;
  }

  /**
   * Appends a group (inserts or updates) to the current config.
   * @returns config instance
   */
  public appendGroup(group: ESLShareGroupConfig): ESLShareConfig {
    setConfigSectionItem(this.groups, group);
    this._onUpdate();
    return this;
  }

  @decorate(microtask)
  protected _onUpdate(): void {
    this.dispatchEvent(new CustomEvent('change'));
  }
}
