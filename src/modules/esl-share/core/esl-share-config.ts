import defaultConfig from '../config/default.json';
import {ESLShareConfigButtons} from './esl-share-config-buttons';

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

function createConfigButtons(cfg: ESLShareConfigShape): ESLShareConfigButtons {
  return new ESLShareConfigButtons(cfg);
}

/** The definition of `ESLShare` component configuration */
export interface ESLShareConfigShape {
  /** List of sharing buttons configuration */
  buttons: ESLShareButtonConfig[];
  /** List of share button groups configurations */
  groups: ESLShareGroupConfig[];
}

export class ESLShareConfig {
  protected static _config: Promise<ESLShareConfigButtons> = Promise.resolve(createConfigButtons(defaultConfig));

  /**
   * Gets promise with buttons config instance.
   * @returns Promise of the current config instance
   */
  public static get(): Promise<ESLShareConfigButtons> {
    return ESLShareConfig._config;
  }

  /**
   * Sets config with a promise of a new config object or using a config provider function.
   * @returns Promise of the current config
   */
  public static set(provider?: ESLShareConfigProviderType | ESLShareConfigShape): Promise<ESLShareConfigButtons> {
    if (typeof provider === 'function') ESLShareConfig._config = provider().then(createConfigButtons);
    if (typeof provider === 'object') ESLShareConfig._config = Promise.resolve(createConfigButtons(provider));
    return ESLShareConfig.get();
  }
}

export * from './esl-share-config-buttons';
