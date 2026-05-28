export type ESLCarouselAutoplayBehaviour = 'pause' | 'restart';

export type ESLCarouselAutoplayState = 'disabled' | 'active' | 'paused' | 'blocked' | 'idle';

export type ESLCarouselAutoplayHostState = ESLCarouselAutoplayState | 'unavailable';

export type ESLCarouselAutoplayReason =
  | 'user:start:call'
  | 'user:pause:call'
  | 'user:stop:call'
  | 'user:start:control'
  | 'user:pause:control'
  | 'user:stop:control'
  | 'system:start:auto'
  | 'system:pause:block'
  | 'system:stop:block'
  | 'system:stop:config'
  | 'system:stop:slide-change'
  | 'system:idle';
