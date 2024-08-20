import {SnapshotMatcher} from './image/snapshot-matcher';
import type {SnapshotMatcherOptions} from './image/snapshot-matcher';

expect.extend({async toMatchImageSnapshot(received: Buffer, options: SnapshotMatcherOptions = {}) {
  return new SnapshotMatcher(this, received, options).match();
}});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    export interface Matchers<R> {
      toMatchImageSnapshot(options?: SnapshotMatcherOptions): Promise<R>;
    }
  }
}
