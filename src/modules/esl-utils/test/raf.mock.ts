import type {AnyToAnyFnSignature} from '../misc/functions';

export class RAFMock {
  private handleCounter = 0;
  private queue = new Map();

  requestAnimationFrame(callback: AnyToAnyFnSignature): number {
    const handle = this.handleCounter++;
    this.queue.set(handle, callback);
    return handle;
  }

  cancelAnimationFrame(handle: number): void {
    this.queue.delete(handle);
  }

  triggerNextAnimationFrame(time = performance.now()): void {
    const nextEntry = this.queue.entries().next().value;
    if (nextEntry === undefined) return;

    const [nextHandle, nextCallback] = nextEntry;

    nextCallback(time);
    this.queue.delete(nextHandle);
  }
  triggerAllAnimationFrames(time = performance.now()): void {
    while (this.queue.size > 0) this.triggerNextAnimationFrame(time);
  }

  reset(): void {
    this.queue.clear();
    this.handleCounter = 0;
  }

  static applyMock(): void {
    if (RAFMock.instance) return;
    const instance = new RAFMock();
    window.requestAnimationFrame = instance.requestAnimationFrame.bind(instance);
    window.cancelAnimationFrame = instance.cancelAnimationFrame.bind(instance);
    (window as any).rafMockImpl = instance;
  }
  static get instance(): RAFMock {
    return (window as any).rafMockImpl;
  }
}
