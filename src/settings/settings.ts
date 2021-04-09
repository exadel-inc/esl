import {UIPCheckSetting} from './setting/check-setting/check-setting';
import {UIPListSetting} from './setting/list-setting/list-setting';
import {UIPTextSetting} from './setting/text-setting/text-setting';
import {UIPClassSetting} from './setting/class-setting/class-setting';
import {UIPSetting} from './setting/setting';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPRoot} from '../core/root';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {CSSUtil} from '@exadel/esl';

export class UIPSettings extends ESLBaseElement {
  public static is = 'uip-settings';

  @attr({defaultValue: 'Settings'}) public label: string;
  @attr({defaultValue: 'settings-attached'}) public rootClass: string;

  protected playground: UIPRoot;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = this.closest(`${UIPRoot.is}`) as UIPRoot;
    this.bindEvents();
    CSSUtil.addCls(this.playground, this.rootClass);
  }

  protected disconnectedCallback(): void {
    this.unbindEvents();
    CSSUtil.removeCls(this.playground, this.rootClass);
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('valueChange', this._onSettingsChanged);
    this.addEventListener('classChange', this._onClassChange);
    this.playground && this.playground.addEventListener('state:change', this.parseCode);
  }

  protected unbindEvents(): void {
    this.removeEventListener('valueChange', this._onSettingsChanged);
    this.removeEventListener('classChange', this._onClassChange);
    this.playground && this.playground.removeEventListener('state:change', this.parseCode);
  }

  protected _onClassChange(e: any) {
    const {value, selector, values} = e.detail;

    const component = new DOMParser().parseFromString(this.playground.state, 'text/html').body;
    const tags = component.querySelectorAll(selector);
    if (!tags.length) return;

    tags.forEach((tag: HTMLElement) => {
      const removeClass = values.find((val: string) => tag.classList.contains(val));
      removeClass && tag.classList.remove(removeClass);
      tag.classList.add(value);
    });

    EventUtils.dispatch(this, 'request:change', {detail: {source: UIPSettings.is, markup: component.innerHTML}});
  }

  protected _onSettingsChanged(e: any) {
    const {name, value, selector} = e.detail;
    if (!selector || !name) return;

    const component = new DOMParser().parseFromString(this.playground.state, 'text/html').body;
    const tags = component.querySelectorAll(selector);
    if (!tags.length) return;

    if (typeof value !== 'boolean') {
      tags.forEach(tag => tag.setAttribute(name, value));
    } else {
      value ? tags.forEach(tag => tag.setAttribute(name, '')) : tags.forEach(tag => tag.removeAttribute(name));
    }
    EventUtils.dispatch(this, 'request:change', {detail: {source: UIPSettings.is, markup: component.innerHTML}});

  }

  protected get attrSettingsTags(): any[] {
    return [
      ...this.getElementsByTagName(UIPCheckSetting.is),
      ...this.getElementsByTagName(UIPListSetting.is),
      ...this.getElementsByTagName(UIPTextSetting.is),
    ];
  }

  protected get classSettingsTags(): any[] {
    return [...this.getElementsByTagName(UIPClassSetting.is)];
  }

  @bind
  public parseCode(e: CustomEvent): void {
    const {markup, source} = e.detail;
    if (source === UIPSettings.is) return;

    if (!this.closest('.settings-wrapper')) {
      this.renderWrapper(markup);
    }

    const component = new DOMParser().parseFromString(markup, 'text/html').body;

    this.setAttrSettings(component);
    this.setClassSettings(component);

  }

  protected renderWrapper(markup: string) {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'settings-wrapper';

    if (this.label) $wrapper.innerHTML = `<span class="section-name">${this.label}</span>`;
    $wrapper.innerHTML += `<uip-settings>${this.innerHTML}</uip-settings>`;
    this.parentElement?.replaceChild($wrapper, this);
  }

  protected setAttrSettings(component: HTMLElement): void {
    for (let settingTag of this.attrSettingsTags) {
      settingTag = settingTag as typeof UIPSetting;
      const {name, selector} = settingTag;

      if (!selector || !name) continue;

      const attrValues = Array.prototype.map.call(component.querySelectorAll(selector),
        (tag: HTMLElement) => tag.getAttribute(name));
      if (!attrValues.length) continue;

      if (attrValues.length === 1) {
        const [val] = attrValues;
        (val === null) ? settingTag.removeAttribute('value') : settingTag.setAttribute('value', val);
      } else {
        attrValues.every((value: string) => value === attrValues[0]) ?
          settingTag.setAttribute('value', attrValues[0]) : settingTag.setAttribute('value', 'null');
      }
    }
  }

  protected setClassSettings(component: HTMLElement): void {
    for (let classSetting of this.classSettingsTags) {
      classSetting = classSetting as UIPClassSetting;
      const {selector, values} = classSetting;

      const classLists: DOMTokenList[] = Array.prototype.map.call(component.querySelectorAll(selector),
        (tag: HTMLElement) => tag.classList);
      if (!classLists.length) continue;

      const item = values.find((val: string) => classLists[0].contains(val));

      if (classLists.length === 1) {
        item ? (classSetting.value = item) : (classSetting.value = 'null');
      } else {
        classLists.every((classList: DOMTokenList) => classList.contains(item)) ?
          classSetting.value = item : classSetting.value = 'null';
      }
    }
  }
}

