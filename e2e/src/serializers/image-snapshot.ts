import {SnapshotDataProcessor} from './image-snapshot.pocessor';
import {SnapshotMatcher} from './image-snapshot.matcher';
import type {SnapshotMatcherOptions} from './image-snapshot.matcher';

expect.extend({async toMatchImageSnapshot(received: Buffer, options: SnapshotMatcherOptions = {}) {
  const imageList = await SnapshotDataProcessor.process(this, received);
  return new SnapshotMatcher(imageList, options).match();
}});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    export interface Matchers<R> {
      toMatchImageSnapshot(options?: SnapshotMatcherOptions): Promise<R>;
    }
  }
}
