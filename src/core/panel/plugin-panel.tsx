import {CSSClassUtils} from '@exadel/esl/modules/esl-utils/dom';
import {skipOneRender} from '@exadel/esl/modules/esl-utils/async';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
import {attr, boolAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../base/plugin';

export class UIPPluginPanel extends UIPPlugin {

  public static observedAttributes: string[] = ['vertical', 'collapsed', 'compact', ...UIPPlugin.observedAttributes];

  /** Marker to make header compact */
  @boolAttr() public compact: boolean;

  /** Marker to collapse editor area */
  @boolAttr() public collapsed: boolean;

  /** Marker to make enable toggle collapse action for section header */
  @boolAttr() public collapsible: boolean;

  /** Marker to make plugin panel vertical */
  @attr({defaultValue: 'not all'}) public vertical: string;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('uip-plugin-panel');
    this._onLayoutModeChange();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    const type = this.constructor as typeof UIPPluginPanel;
    if (attrName === 'vertical') {
      this.$$off(this._onLayoutModeChange);
      this.$$on(this._onLayoutModeChange);
      this._onLayoutModeChange();
    }
    if (attrName === 'compact') {
      this.root?.classList.toggle(type.is + '-compact', this.compact);
    }
  }

  /** Handle collapsing trigger clicks */
  @listen({
    event: 'click',
    selector: '.uip-plugin-header-trigger',
  })
  protected _onCollapseClick(): void {
    if (this.collapsible) this.collapsed = !this.collapsed;
  }

  @listen({
    event: 'change',
    target: (settings: UIPPluginPanel) => ESLMediaQuery.for(settings.vertical)
  })
  protected _onLayoutModeChange(): void {
    const type = this.constructor as typeof UIPPluginPanel;
    const isVertical = ESLMediaQuery.for(this.vertical).matches;
    this.$$cls('vertical', isVertical);
    this.root && CSSClassUtils.toggle(this.root, type.is + '-vertical', isVertical);
    this.root && CSSClassUtils.add(this.root, 'no-animate', this);
    skipOneRender(() => this.root && CSSClassUtils.remove(this.root, 'no-animate', this));
  }
}
