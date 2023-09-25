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

/** The definition of `ESLShare` component configuration */
export interface ESLShareConfig {
  /** List of sharing buttons configuration */
  buttons: ESLShareButtonConfig[];
  /** List of share button groups configurations */
  groups: ESLShareGroupConfig[];
}

function getConfigSectionItem<T extends ESLShareButtonConfig | ESLShareGroupConfig>(section: T[], name: string): T | undefined {
  return section.find((item) => item.name === name);
}

/**
 * Selects the buttons for the given list and returns their configuration.
 * @returns config of buttons
 */
export function selectButtonsForList(config: ESLShareConfig, list: string): ESLShareButtonConfig[] {
  return list.split(' ').reduce((res, item) => {
    const [btnName, groupName] = item.split('group:');
    if (groupName) {
      const groupConfig = getConfigSectionItem(config.groups, groupName);
      if (groupConfig) return res.concat(selectButtonsForList(config, groupConfig.list));
    } else {
      const btnConfig = getConfigSectionItem(config.buttons, btnName);
      if (btnConfig) res.push(btnConfig);
    }
    return res;
  }, [] as ESLShareButtonConfig[]);
}
