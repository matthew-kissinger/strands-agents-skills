import { BeforeToolsEvent } from '@strands-agents/sdk';

// Scope this set to tools sharing the same mutable state, not every writer in an app.
export function installBatchGuard(agent, writers) {
  return agent.addHook(BeforeToolsEvent, (event) => {
    const calls = event.message.content.filter((b) => b.type === 'toolUseBlock');
    if (calls.length > 1 && calls.some((b) => writers.has(b.name))) {
      event.cancel = 'This batch mixes a shared-state writer with another call. '
        + 'No tools ran. Issue the writer alone, then read the resulting revision.';
    }
  });
}
