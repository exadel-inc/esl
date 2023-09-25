export * from './core/api';

export * from './core/targets/resize.target';
export * from './core/targets/decorated.target';
export * from './core/targets/swipe.target';

export type {
  DelegatedEvent,
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerDescriptorFn,
  ESLListenerDescriptorExt,
  ESLListenerTarget,
  ESLListenerDefinition
} from './core/types';
export type {
  ESLEventListener,
} from './core/listener';
