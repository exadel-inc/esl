
import {ESLMediaQuery} from '../../all';
import type {IMediaQueryCondition} from '../../esl-media-query/core/conditions/media-query-base';

export type Serializer<T> = {
  parse: (value: string) => T;
  serialize: (value: T) => string | boolean | null;
};

export const  toNumber: Serializer<number> = {
  parse: (val: string): number => +val,
  serialize: String,
};

export const  toMediaQueryCondition: Serializer<IMediaQueryCondition> = {
  parse: ESLMediaQuery.for,
  serialize: String,
};

