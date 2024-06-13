import type {SnapshotMatcherOptions} from './image';

declare global {
  namespace jest {
    export interface Matchers<R> {
      toMatchImageSnapshot(options?: SnapshotMatcherOptions): Promise<R>;
    }
  }
}
