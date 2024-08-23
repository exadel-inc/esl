import React from 'jsx-dom';

import {CSSClassUtils} from '@exadel/esl/modules/esl-utils/dom';
import {skipOneRender} from '@exadel/esl/modules/esl-utils/async';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
import {attr, boolAttr, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../base/plugin';

export abstract class UIPPluginPanel extends UIPPlugin {
  public static readonly observedAttributes: string[] = ['vertical', 'collapsible', ...UIPPlugin.observedAttributes];

  /** Marker to collapse editor area */
  @boolAttr() public collapsed: boolean;

  /** Marker to make enable toggle collapse action for section header */
  @boolAttr() public collapsible: boolean;

  /** Marker that indicates resizable state of the panel */
  @boolAttr() public resizable: boolean;

  /** Marker that indicates resizing state of the panel */
  @boolAttr() public resizing: boolean;

  /** Marker to make plugin panel vertical */
  @attr({defaultValue: 'not all'}) public vertical: string;

  /** Start point */
  protected _startPoint: number = NaN;

  /** Start size */
  protected _startSize: number = NaN;

  /** Plugin header icon */
  protected get $icon(): JSX.Element | null {
    return null;
  }

  /** Plugin header additional buttons section */
  protected get $toolbar(): HTMLElement | null {
    return null;
  }

  /** Header section block */
  @memoize()
  protected get $header(): HTMLElement {
    const type = this.constructor as typeof UIPPluginPanel;
    const a11yLabel = this.collapsible ? 'Collapse/expand' + this.label : this.label;
    const hasToolbar = this.$toolbar?.children.length;
    return (
      <div className={type.is + '-header uip-plugin-header' + (this.label ? '' : ' no-label') + (hasToolbar ? ' has-toolbar' : '')}>
        {this.$icon ? <span className='uip-plugin-header-icon' title={this.label}>{!this.isVertical ? this.$icon : ''}</span> : ''}
        <span class={`uip-plugin-header-title ${type.is}-title`}>{this.label}</span>
        {this.collapsible ? <button type='button' className='uip-plugin-header-trigger' aria-label={a11yLabel} title={a11yLabel}/> : ''}
        {hasToolbar ? this.$toolbar : ''}
      </div>
    ) as HTMLElement;
  }

  /** Creates resize area element */
  @memoize()
  protected get $resize(): HTMLElement {
    return (<div className='uip-plugin-resize-bar' />) as HTMLElement;
  }

  /** @returns if the plugin should be rendered vertically */
  public get isVertical(): boolean {
    return ESLMediaQuery.for(this.vertical).matches;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('uip-plugin-panel');
    this._onLayoutModeChange();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (attrName === 'vertical') {
      this.$$off(this._onLayoutModeChange);
      this.$$on(this._onLayoutModeChange);
      this._onLayoutModeChange();
    }
  }

  /** Handles collapsing trigger clicks */
  @listen({
    event: 'click',
    selector: '.uip-plugin-header-trigger',
  })
  protected _onCollapseClick(): void {
    if (!this.collapsible) return;
    this.collapsed = !this.collapsed;
    this.resizing = false;
  }

  /** Handles vertical media query change */
  @listen({
    event: 'change',
    target: (settings: UIPPluginPanel) => ESLMediaQuery.for(settings.vertical)
  })
  protected _onLayoutModeChange(): void {
    const {isVertical} = this;
    const type = this.constructor as typeof UIPPluginPanel;
    this.$$cls('vertical', isVertical);
    CSSClassUtils.toggle(this.$root!, type.is + '-vertical', isVertical);
    CSSClassUtils.add(this.$root!, 'no-animate', this);
    skipOneRender(() => this.$root && CSSClassUtils.remove(this.$root, 'no-animate', this));
  }

  // Resize logic

  /** Handles resize start */
  @listen({
    event: 'pointerdown',
    selector: '.uip-plugin-resize-bar'
  })
  protected _onPointerStart(event: PointerEvent): void {
    if (!this.resizable || this.collapsed) return;
    const {isVertical} = this;
    this.resizing = true;
    const prop = isVertical ? '--uip-plugin-width' : '--uip-plugin-height';
    this._startSize = parseFloat(getComputedStyle(this).getPropertyValue(prop) || '0');
    this._startPoint = isVertical ? event.x : event.y;
    if (this.$resize.setPointerCapture) this.$resize.setPointerCapture(event.pointerId);

    this.$$on(this._onPointerMove);
  }

  /** Handles resize end */
  @listen({
    event: 'pointerup',
    selector: '.uip-plugin-resize-bar'
  })
  protected _onPointerEnd(event: PointerEvent): void {
    this.resizing = false;
    if (this.$resize.releasePointerCapture) this.$resize.releasePointerCapture(event.pointerId);
    this.$$off(this._onPointerMove);
  }

  /** Handles resize */
  @listen({
    auto: false,
    event: 'pointermove',
    selector: '.uip-plugin-resize-bar'
  })
  protected _onPointerMove(event: PointerEvent): void {
    if (!this.resizing) return;
    const {isVertical} = this;
    const delta = this._startPoint - (isVertical ? event.x : event.y);
    const value = Math.round(this._startSize + delta * (isVertical ? 1 : -1));
    const prop = isVertical ? '--uip-plugin-width' : '--uip-plugin-height';
    this.style.setProperty(prop, `${value}px`);
  }
}
