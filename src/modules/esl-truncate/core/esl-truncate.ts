import {debounce, memoize, ready} from '../../all';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';

interface Iconfig {
  height: number;
  text: string;
  textLength: number;
  item: HTMLElement | ChildNode;
  step: number;
}

interface IconfigCheckLastLine {
  height: number;
  text: string;
  item: HTMLElement | ChildNode;
}

interface IconfigCheckLastWord {
  height: number;
  item: HTMLElement | ChildNode;
  arr: string[];
}

@ExportNs('Truncate')
export class ESLTruncate extends ESLBaseElement {
  public static is = 'esl-truncate';

  @attr({defaultValue: ''}) public lineCount: string;
  @attr({defaultValue: '...'}) public sign: string;
  @boolAttr({}) public inactive: boolean;


  protected deferredTruncate = debounce(() => this.refresh(), 100);
  protected _resizeObserver = new ResizeObserver(this.deferredTruncate);
  protected heightWithoutLastChild: number;

  static get observedAttributes(): string[] {
    return ['inactive'];
  }

  public originalText: string;

  public get status(): boolean {
    return this.inactive;
  }

  public setInactiv(flag: boolean): void {
    flag ? this.setAttribute('inactive', '') : this.removeAttribute('inactive');
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this.originalText = this.innerHTML;
    this.init();
    this._resizeObserver.observe(this);
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver.unobserve(this);
  }

  public getContent(item: HTMLElement): NodeListOf<ChildNode> {
    return item.childNodes;
  }

  @memoize()
  protected get checkStyle(): boolean {
    return CSS && CSS.supports('-webkit-line-clamp', '1') && this.sign === '...';
  }

  public refresh(): void {
    this.innerHTML = this.originalText;
    this.classList.remove('auto-height');
    this.classList.remove('truncate');
    this.init();
  }

  @memoize()
  protected get height(): number {
    const style = getComputedStyle(this);
    const height = parseInt(style.height, 10);
    const maxHeight = parseInt(style.maxHeight, 10);
    return maxHeight > height ? maxHeight : height;
  }

  @ready
  public init(): void {
    if (this.checkStyle && !this.childElementCount) {
      this.updateTruncationCss();
    } else if (!this.childElementCount) {
      const realHeight = this.getAvaliableHeight(this);
      this.innerHTML = '';
      this.simpleTruncate(this, this.originalText, realHeight);
    } else {
      this.richTextTruncate(this);
    }
  }

  private simpleTruncate(item: ChildNode  | HTMLElement, text: string, realHeight: number): void {
    const config: Iconfig = {
      height: realHeight,
      text,
      textLength: Math.ceil(text.length / 2),
      step: Math.ceil(text.length / 4),
      item,
    };
    item.textContent = item.textContent + this.sign;
    this.classList.add('auto-height');
    this.checkHeight(config);
  }

  private getAvaliableHeight(el: HTMLElement, height?: number): number {
    const style = getComputedStyle(el);
    const lineHeight = parseInt(style.lineHeight, 10);
    if (this.lineCount) return +this.lineCount * lineHeight;
    if (height) {
      const paddingTop = parseInt(style.paddingTop, 10);
      const paddingBottom = parseInt(style.paddingBottom, 10);
      const marginTop = parseInt(style.marginTop, 10);
      const marginBottom = parseInt(style.marginBottom, 10);
      const incHeight = this.height - height;
      const incHeightRounded = incHeight - (incHeight % lineHeight);
      return height + incHeightRounded + paddingTop + paddingBottom + marginTop + marginBottom;
    }
    return this.height - (this.height % lineHeight);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'inactive' && this.inactive) {
      if (this.checkStyle && !this.childElementCount) this.style.webkitLineClamp = 'none';
      this.innerHTML = this.originalText;
    } else if (attrName === 'inactive' && !this.inactive) {
      this.init();
    }
  }

  private richTextTruncate(el: HTMLElement): void {
    const childNode = el.cloneNode(true).childNodes;
    const content = Array.from(childNode).filter((item: any) => (item.data?.match(/!\n|\S/) || item.nodeType === 1));
    el.innerHTML = '';
    let heightWithoutLastChild = 0;

    for (let i = 0; i <= content.length; i++) {
      el.appendChild(content[i].cloneNode(true));
      if (this.scrollHeight >= this.height) break;
      heightWithoutLastChild = this.scrollHeight;
    }

    const avaliableHeight = this.getAvaliableHeight(el, heightWithoutLastChild ? heightWithoutLastChild : this.heightWithoutLastChild);
    this.checkAvaliableHeight(avaliableHeight, heightWithoutLastChild, el);
  }

  private checkLastChildNodeType(el: HTMLElement, avaliableHeight: number): void {
    if (el.lastChild?.nodeType === 1 && el.lastElementChild?.childElementCount) {
      this.richTextTruncate(el.lastElementChild as HTMLElement);
    } else if (el.lastChild && el.lastChild.textContent) {
      this.simpleTruncate(el.lastChild, el.lastChild.textContent, avaliableHeight);
    }
  }

  private checkAvaliableHeight(avaliableHeight: number, heightWithoutLastChild: number, el: HTMLElement): void {
    if (this.height < avaliableHeight) {
      if (!heightWithoutLastChild && el.previousSibling) {
        const previousSibling = this.getLastChild(el.previousSibling);
        previousSibling.textContent = `${previousSibling.textContent}${this.sign}`;
        this.removeChild(el);
      } else if (heightWithoutLastChild && el.lastChild) {
        el.removeChild(el.lastChild);
        const lastChild = this.getLastChild(el.lastChild);
        lastChild.textContent = `${lastChild.textContent}${this.sign}`;
      }
    } else if (avaliableHeight === heightWithoutLastChild && el.lastChild) {
      el.removeChild(el.lastChild);
      const lastChild = this.getLastChild(el.lastChild);
      lastChild.textContent = lastChild?.textContent + this.sign;
      const arr = lastChild.textContent?.split(' ');
      heightWithoutLastChild < this.scrollHeight && this.checkLastWord({height: heightWithoutLastChild, item: lastChild, arr});
    } else {
      this.heightWithoutLastChild = heightWithoutLastChild;
      this.checkLastChildNodeType(el, avaliableHeight);
    }
  }

  private getLastChild(el: ChildNode): ChildNode {
    const childNodes = el.childNodes;
    return childNodes[childNodes.length - 1];
  }

  private checkHeight(config: Iconfig): void {
    let caunter: number = 0;
    const callBack = ({height, text, textLength, item, step}: Iconfig): void => {
      caunter++;
      if (caunter > 200) {
        this.checkLastLine({height, text, item});
        return;
      }
      if (height < this.scrollHeight) {
        const indexEnd = text.indexOf(' ', textLength - step);
        item.textContent = text.slice(0, indexEnd);
        callBack({height, text, textLength, item, step: step + Math.floor(step / 2)});
        return;
      }
      if (height > this.scrollHeight) {
        const indexEnd = text.indexOf(' ', textLength + step);
        item.textContent = item.textContent + text.slice(0, indexEnd);
        callBack({height, text, textLength: indexEnd, item, step: Math.floor(step / 2)});
      } else {
        this.checkLastLine({height, text, item});
      }
    };
    callBack({...config});
  }

  private checkLastLine(config: IconfigCheckLastLine): void {
    let caunter = 0;
    const callBack = ({height, text, item}: IconfigCheckLastLine): void => {
      const arr = item.textContent?.split(' ') || [];
      caunter++;
      if (caunter > 100) {
        this.checkLastWord({height, item, arr});
        return;
      }

      if (height < this.scrollHeight) {
        this.checkLastWord({height, item, arr});
      } else if (item.textContent) {
        const length = item.textContent.length + 1;
        const indexEnd = text.indexOf(' ', length);
        item.textContent = text.slice(0, indexEnd) + this.sign;
        callBack({height, text, item});
      }
    };
    callBack({...config});
  }

  private checkLastWord(config: IconfigCheckLastWord): void {
    let caunter = 0;
    const callBack = ({height, item, arr}: IconfigCheckLastWord): void => {
      caunter++;
      arr?.pop();
      if (caunter > 3) {
        item.textContent = arr?.join(' ') + this.sign;
        return;
      }
      item.textContent = arr?.join(' ') + this.sign;
      height < this.scrollHeight && callBack({height, item, arr});
    };
    callBack({...config});
  }

  private updateTruncationCss(): void {
    if (this.lineCount) {
      this.style.webkitLineClamp = this.lineCount;
    } else {
      this.style.webkitLineClamp = `${this.getNumberLines(this)}`;
    }
    this.classList.add('truncate');
  }

  protected getNumberLines(item: HTMLElement): number {
    const lineHeight = getComputedStyle(item).lineHeight;
    return Math.floor(this.height / parseInt(lineHeight, 10));
  }

}

declare global {
  export interface ESLLibrary {
    Truncate: typeof ESLTruncate;
  }
  export interface HTMLElementTagNameMap {
    'esl-truncate': ESLTruncate;
  }
}
