import {afterNextRender} from '../raf';

/** @returns promise that will be resolved after next render */
export const promisifyNextRender = (): Promise<void> => new Promise((resolve) => afterNextRender(resolve));
