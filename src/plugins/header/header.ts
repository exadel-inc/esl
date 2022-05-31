import {UIPPlugin} from '../../core/base/plugin';

/**
 * Custom element that displays active markup.
 * @extends UIPPlugin
 */
export class UIPHeader extends UIPPlugin {
  static is = 'uip-header';

  // TODO: note about auto content
  // option 0 no need of header - do not add a header tag
  // option 1 user wants default - add a header tag witout child elements
  // option 2 user wants custom header- user add whatever needed, header skip auto-fill
}
