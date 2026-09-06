import test from 'node:test';
import assert from 'node:assert/strict';
import { Agent, FunctionTool } from '@strands-agents/sdk';
import { VercelModel } from '@strands-agents/sdk/models/vercel';
import { ScriptedModel } from '../skills/strands-agents/scripts/scripted-model.mjs';
import { installBatchGuard } from '../skills/strands-agents/scripts/batch-guard.mjs';
import { ensureStreamStart } from '../skills/strands-agents/scripts/stream-start.mjs';

function fixture(turns) {
  const ran = [];
  const tools = ['edit', 'preview', 'inspect'].map(name => new FunctionTool({
    name, description: `${name} the shared draft`, callback: () => { ran.push(name); return 'ok'; },
  }));
  const agent = new Agent({ model: new ScriptedModel(turns), tools });
  installBatchGuard(agent, new Set(['edit']));
  return { agent, ran };
}
test('real SDK rejects both mixed calls before either tool runs', async () => {
  const { agent, ran } = fixture([{ calls: [{ name: 'edit' }, { name: 'preview' }] }, { text: 'stopped' }]);
  await agent.invoke('edit and preview');
  assert.deepEqual(ran, []);
  const results = agent.messages.flatMap(m => m.content).filter(b => b.type === 'toolResultBlock');
  assert.equal(results.length, 2);
  assert.ok(results.every(r => r.status === 'error'));
});
test('solo writes and reader batches execute through the real SDK', async () => {
  const { agent, ran } = fixture([
    { calls: [{ name: 'edit' }] },
    { calls: [{ name: 'preview' }, { name: 'inspect' }] }, { text: 'done' },
  ]);
  await agent.invoke('edit then review');
  assert.equal(ran[0], 'edit');
  assert.deepEqual([...ran].sort(), ['edit', 'inspect', 'preview']);
});
function model(parts) {
  return { modelId: 'fake', value() { return this.modelId; }, async doStream() {
    return { metadata: 'preserved', stream: new ReadableStream({ start(c) {
      parts.forEach(p => c.enqueue(p)); c.close();
    } }) };
  } };
}
async function collect(m) {
  const result = await m.doStream({});
  assert.equal(result.metadata, 'preserved');
  return Array.fromAsync(result.stream);
}
test('repair prepends exactly one start and preserves all other parts', async () => {
  const parts = [{ type: 'response-metadata' }, { type: 'finish' }];
  const wrapped = ensureStreamStart(model(parts));
  assert.equal(wrapped.value(), 'fake');
  assert.deepEqual(await collect(wrapped), [{ type: 'stream-start', warnings: [] }, ...parts]);
});
test('conforming and empty streams remain unchanged', async () => {
  const parts = [{ type: 'stream-start', warnings: [] }, { type: 'finish' }];
  assert.deepEqual(await collect(ensureStreamStart(model(parts))), parts);
  assert.deepEqual(await collect(ensureStreamStart(model([]))), []);
});
test('stream failures propagate without a fabricated finish', async () => {
  const wrapped = ensureStreamStart({ async doStream() { return {
    stream: new ReadableStream({ start(c) { c.error(new Error('transport failed')); } }),
  }; } });
  const { stream } = await wrapped.doStream({});
  await assert.rejects(Array.fromAsync(stream), /transport failed/);
});

test('real Vercel adapter reproduces missing-start failure and accepts narrow repair', async () => {
  const parts = [
    { type: 'response-metadata', id: 'offline' },
    { type: 'text-start', id: 'text' },
    { type: 'text-delta', id: 'text', delta: 'complete' },
    { type: 'text-end', id: 'text' },
    { type: 'finish', finishReason: { unified: 'stop', raw: 'stop' }, usage: {
      inputTokens: { total: 1 }, outputTokens: { total: 1 },
    } },
  ];
  const make = repaired => {
    const provider = { ...model(parts), specificationVersion: 'v3', provider: 'offline', supportedUrls: {} };
    return new Agent({ model: new VercelModel({ provider: repaired ? ensureStreamStart(provider) : provider }) });
  };
  await assert.rejects(make(false).invoke('test'), /Stream ended without completing a message/);
  const agent = make(true);
  await agent.invoke('test');
  assert.ok(agent.messages.some(m => m.content.some(b => b.type === 'textBlock' && b.text === 'complete')));
});
