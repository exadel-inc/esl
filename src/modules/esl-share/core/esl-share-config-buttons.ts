import type {ESLShareConfigShape, ESLShareButtonConfig, ESLShareGroupConfig} from './esl-share-config';

/** Gets item of the section by name */
function getConfigSectionItem<T extends ESLShareButtonConfig | ESLShareGroupConfig>(section: T[], name: string): T | undefined {
  return section.find((item) => item.name === name);
}

/** Class for managing share buttons configurations */
export class ESLShareConfigButtons {
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
