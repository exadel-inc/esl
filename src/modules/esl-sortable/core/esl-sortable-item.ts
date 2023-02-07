import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import type {ESLSortable} from './esl-sortable';

export class ESLSortableItem extends ESLMixinElement {
  static is = 'esl-sortable-item';

  public pos: {
    x: number;
    y: number;
  };

  public get parent(): ESLSortable | null {
    return ESLTraversingQuery.first('::parent(esl-sortable)', this.$host) as ESLSortable;
  }

  public get placeholder(): boolean {
    return this.$$cls('esl-sortable-placeholder');
  }

  public set placeholder(value: boolean) {
    this.$$cls('esl-sortable-placeholder', value);
  }

  public clearInlineStyles(): void {
    const {$host} = this;
    $host.style.position = '';
    $host.style.top = '';
    $host.style.height = '';
    $host.style.width = '';
    $host.style.left = '';
    $host.style.transition = '';
  }
}
