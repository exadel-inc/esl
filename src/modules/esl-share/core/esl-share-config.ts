import {decorate, memoize} from '../../esl-utils/decorators';
import {debounce} from '../../esl-utils/async/debounce';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';

/** {@link ESLShareConfigShape} provider type definition */
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
   * Sets config with a promise of a new config object or using a config provider function.
   * Each of the buttons and groups specified in the new config will be appended to the current config.
   * @returns Promise of the current config
   */
  public static set(provider?: ESLShareConfigProviderType | ESLShareConfig): Promise<ESLShareConfig> {
    if (typeof provider === 'function') return provider().then(ESLShareConfig.append);
    if (typeof provider === 'object') ESLShareConfig.append(provider);
    return Promise.resolve(ESLShareConfig.instance);
  }

  /**
   * Appends buttons and groups from the passed config to the current config.
   * @returns config instance
   */
  protected static append(cfg: ESLShareConfig): ESLShareConfig {
    const {instance} = ESLShareConfig;
    if (cfg) {
      cfg.buttons.forEach((button) => instance.appendButton(button));
      cfg.groups.forEach((group) => instance.appendGroup(group));
    }
    return instance;
  }

  protected _buttons: ESLShareButtonConfig[] = [];
  protected _groups: ESLShareGroupConfig[] = [];

  /** @returns config of buttons */
  public get buttons(): ESLShareButtonConfig[] {
    return this._buttons;
  }

  /** @returns config of groups */
  public get groups(): ESLShareGroupConfig[] {
    return this._groups;
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
   * Appends button (inserts or updates) to the current config.
   * @returns config instance
   */
  public appendButton(button: ESLShareButtonConfig): ESLShareConfig {
    setConfigSectionItem(this.buttons, button);
    this._onUpdate();
    return this;
  }

  /**
   * Appends group (inserts or updates) to the current config.
   * @returns config instance
   */
  public appendGroup(group: ESLShareGroupConfig): ESLShareConfig {
    setConfigSectionItem(this.groups, group);
    this._onUpdate();
    return this;
  }

  @decorate(debounce, 25)
  protected _onUpdate(): void {
    this.dispatchEvent(new CustomEvent('change'));
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: 'change', callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'change') {
      console.warn(`[ESL]: ESLShareConfig does not support '${event}' type`);
      return;
    }

    super.addEventListener('change', callback);
  }

  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: 'change', callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'change') return;

    super.removeEventListener('change', callback);
  }
}
