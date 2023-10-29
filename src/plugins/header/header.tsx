import React from 'jsx-dom';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPThemeIcon} from '../theme/uip-theme.icon';
import {UIPDirIcon} from '../direction/uip-dir.icon';

import {UIPSnippets} from './snippets/snippets';

/**
 * Header {@link UIPPlugin} custom element definition
 * Container for {@link UIPSnippets} and {@link UIPOptions} elements
 */
export class UIPHeader extends UIPPlugin {
  static is = 'uip-header';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.childElementCount || this.autofill();
  }

  /** Default configuration rendering */
  protected autofill(): void {
    this.renderSnippets();
    this.append(this.renderDirSwitch());
    this.append(this.renderThemeSwitch());
  }

  /** Renders {@link UIPSnippets} element */
  protected renderSnippets(): void {
    if (this.model?.snippets.length) {
      const snippetsEl = document.createElement(UIPSnippets.is);
      this.prepend(snippetsEl);
    }
  }

  /** Renders {@link UIPThemeSwitch} element */
  protected renderThemeSwitch(): Element {
    return (<uip-toggle-theme><UIPThemeIcon/></uip-toggle-theme>) as Element;
  }

  /** Renders {@link UIPDirSwitch} element */
  protected renderDirSwitch(): Element {
    return (<uip-toggle-dir><UIPDirIcon/></uip-toggle-dir>) as Element;
  }
}
