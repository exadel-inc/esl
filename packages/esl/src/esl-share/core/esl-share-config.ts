import {decorate, memoize} from '../../esl-utils/decorators';
import {microtask} from '../../esl-utils/async/microtask';
import {isObject, deepMerge} from '../../esl-utils/misc/object';
import {uniq} from '../../esl-utils/misc/array';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';

import type {PropertyProvider} from '../../esl-utils/misc/functions';

/** The definition of the sharing button */
export interface ESLShareButtonConfig {
  /** Name of the share action, which is performed after the button is pressed */
  action: string;
  /** HTML content of the share icon */
  icon?: string;
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

/** Object containing {@link ESLShareButtonConfig} and {@link ESLShareGroupConfig} definitions */
export interface ESLShareConfigInit {
  /** List of share buttons configurations */
  buttons?: ESLShareButtonConfig[];
  /** List of share buttons groups configurations */
  groups?: ESLShareGroupConfig[];
}

const isNamedObject = (obj: any): obj is Record<string, any> & {name: string} => isObject(obj) && typeof obj.name === 'string';
const isGroupCfg = (cfg: any): cfg is ESLShareGroupConfig => isNamedObject(cfg) && typeof cfg.list === 'string';
const isButtonCfg = (cfg: any): cfg is ESLShareButtonConfig => isNamedObject(cfg) && typeof cfg.action === 'string';

/** Class for managing share buttons configurations */
export class ESLShareConfig extends SyntheticEventTarget {
  /** @returns ESLShareConfig shared instance */
  @memoize()
  public static get instance(): ESLShareConfig {
    return new ESLShareConfig();
  }

  /**
   * Updates the configuration with either a {@link ESLShareConfigInit} object or provider function.
   * Every button and group specified in the new config will be added to the current configuration.
   * @returns ESLShareConfig instance
   */
  public static set(cfg: ESLShareConfigInit | PropertyProvider<ESLShareConfigInit>): ESLShareConfig;
  /**
   * Updates the configuration with promise resolved to {@link ESLShareConfigInit} or promise provider function.
   * Every button and group specified in the new config will be added to the current configuration.
   * @returns Promise<ESLShareConfig> instance
   */
  public static set(
    provider: Promise<Partial<ESLShareConfig>> | PropertyProvider<Promise<ESLShareConfigInit>>
  ): Promise<ESLShareConfig>;
  public static set(provider: any): ESLShareConfig | Promise<ESLShareConfig> {
    if (typeof provider === 'function') return this.set(provider());
    if (!isObject(provider)) return ESLShareConfig.instance;
    if (provider instanceof Promise) return provider.then((cfg: ESLShareConfigInit) => this.set(cfg));
    if (Array.isArray(provider.groups)) ESLShareConfig.instance.append(provider.groups);
    if (Array.isArray(provider.buttons)) ESLShareConfig.instance.append(provider.buttons);
    return ESLShareConfig.instance;
  }

  /** Updates items configuration from the list with the specified partial config */
  public static update(query: string, changes: Partial<ESLShareButtonConfig>): ESLShareConfig {
    return ESLShareConfig.instance.update(query, changes);
  }

  /** Appends single button or group to current configuration */
  public static append(cfg: ESLShareButtonConfig | ESLShareGroupConfig | ESLShareButtonConfig[] | ESLShareGroupConfig[]): ESLShareConfig {
    return ESLShareConfig.instance.append(cfg);
  }

  protected readonly _groups: Map<string, string> = new Map();
  protected readonly _buttons: Map<string, ESLShareButtonConfig> = new Map();

  protected constructor() {
    super();
  }

  /** @returns list of all available groups */
  public get groups(): ESLShareGroupConfig[] {
    return Array.from(this._groups.entries()).map(([name, list]) => ({name, list}));
  }

  /** @returns list of all available buttons */
  public get buttons(): ESLShareButtonConfig[] {
    return Array.from(this._buttons.values());
  }

  /** Normalize list string by removing groups and extra whitespaces */
  protected resolve(query: string): string[] {
    if (/\sall\s/.test(query)) return Array.from(this._buttons.keys());
    const groups = new Set<string>(); // Deduplicate groups
    while (query.includes('group:')) {
      query = query.replace(/group:(\S+)/gi, (term: string, name: string) => {
        if (groups.has(name)) return '';
        groups.add(name);
        return this._groups.get(name) || '';
      });
    }
    return query.split(' ').filter(Boolean);
  }

  /**
   * Selects the buttons for the given list and returns their configuration.
   * @returns config of buttons
   */
  public get(query: string): ESLShareButtonConfig[] {
    const terms = this.resolve(query);
    const list: (ESLShareButtonConfig | undefined)[] = [];
    terms.forEach((name) => {
      name === 'all' ? list.push(...this.buttons) : list.push(this.getButton(name));
    });
    return uniq(list.filter(Boolean) as ESLShareButtonConfig[]);
  }

  /** Clears the configuration */
  public clear(): ESLShareConfig {
    this._buttons.clear();
    this._groups.clear();
    this._onUpdate();
    return this;
  }

  /**
   * Gets the group of buttons configuration.
   * @returns config of group
   */
  public getGroup(name: string): ESLShareGroupConfig | undefined {
    const list = this._groups.get(name);
    return list ? {name, list} : undefined;
  }

  /**
   * Gets the button configuration.
   * @returns config of button
   */
  public getButton(name: string): ESLShareButtonConfig | undefined {
    return this._buttons.get(name);
  }

  /** Updates the configuration with a {@link ESLShareButtonConfig} or {@link ESLShareGroupConfig} */
  protected add(config: ESLShareButtonConfig | ESLShareGroupConfig): void {
    if (isGroupCfg(config)) this._groups.set(config.name, config.list);
    if (isButtonCfg(config)) this._buttons.set(config.name, config);
  }

  /** Updates the configuration with a {@link ESLShareButtonConfig}(s) or {@link ESLShareGroupConfig}(s) */
  public append(config: ESLShareButtonConfig | ESLShareGroupConfig | ESLShareButtonConfig[] | ESLShareGroupConfig[]): ESLShareConfig {
    if (Array.isArray(config)) {
      config.forEach(this.add, this);
    } else {
      this.add(config);
    }
    this._onUpdate();
    return this;
  }

  /** Updates items configuration from the list with the specified partial config */
  public update(query: string, changes: Partial<ESLShareButtonConfig>): ESLShareConfig {
    for (const btn of this.get(query)) {
      this.append(deepMerge({}, btn, changes));
    }
    return this;
  }

  @decorate(microtask)
  protected _onUpdate(): void {
    this.dispatchEvent(new CustomEvent('change'));
  }
}
