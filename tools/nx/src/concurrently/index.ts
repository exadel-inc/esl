import concurrently from 'concurrently';

import type { ExecutorContext } from '@nx/devkit';

interface RunExecutorOptions {
  targets: string[];
}

export default async function runExecutor(
  options: RunExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = options;

  console.info('=== Concurrently Plugin ===');

  if (!targets || targets.length === 0) {
    console.error('No targets specified.');
    return { success: false };
  }

  const commands = targets.map((target)=> {
    return {
      name: target,
      command: `npx nx run ${target}`
    };
  });

  try {
    await concurrently(commands, {
      cwd: context.root,
      killOthers: ['failure']
    }).result;
  } catch (e) {
    console.error('Error running commands:', e);
    return { success: false };
  }

  return { success: true };
}
