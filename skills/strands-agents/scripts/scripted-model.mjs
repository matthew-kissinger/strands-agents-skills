import { Model } from '@strands-agents/sdk';

// Offline fixture: real SDK loop, prescribed model events, no provider/network.
export class ScriptedModel extends Model {
  constructor(turns) { super(); this.turns = [...turns]; this.index = 0; }
  updateConfig() {}
  getConfig() { return { modelId: 'offline-script' }; }
  async *stream() {
    const turn = this.turns[this.index++];
    if (!turn) throw new Error('Script exhausted: the loop requested an unexpected turn');
    yield { type: 'modelMessageStartEvent', role: 'assistant' };
    if (turn.calls) {
      for (const [i, call] of turn.calls.entries()) {
        yield { type: 'modelContentBlockStartEvent', start: {
          type: 'toolUseStart', name: call.name, toolUseId: `turn-${this.index}-${i}`,
        } };
        yield { type: 'modelContentBlockDeltaEvent', delta: {
          type: 'toolUseInputDelta', input: JSON.stringify(call.input ?? {}),
        } };
        yield { type: 'modelContentBlockStopEvent' };
      }
    } else {
      yield { type: 'modelContentBlockStartEvent' };
      yield { type: 'modelContentBlockDeltaEvent', delta: { type: 'textDelta', text: turn.text } };
      yield { type: 'modelContentBlockStopEvent' };
    }
    yield { type: 'modelMessageStopEvent', stopReason: turn.calls ? 'toolUse' : 'endTurn' };
  }
}
