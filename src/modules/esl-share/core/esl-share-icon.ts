import {ESLBaseElement} from '../../esl-base-element/core';
import {attr} from '../../esl-utils/decorators';

export class ESLShareIcon extends ESLBaseElement {
  public static is = 'esl-share-icon';

  public static DEFAULT_ICON_BG_COLOR = '#FFF';

  @attr() public netId: string;
  @attr() public name: string;
  @attr() public icon: string;
  @attr() public link: string;
}
