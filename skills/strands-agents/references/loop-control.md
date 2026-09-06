# Control before dispatch

## Concurrent tools and one mutable object

If `edit` writes a draft while `preview` reads it in the same concurrent batch, the
preview may capture either version. Two writers can conflict as well. A successful
tool result says nothing about which state it observed.

First decide the state model. Immutable revision arguments or transactions may
solve the problem better than scheduling. Sequential execution is a valid simple
choice. If read-only batches benefit from concurrency, reject an entire mixed batch
before any tool runs and ask the model to issue the writer alone.

In the TypeScript SDK field path, `BeforeToolsEvent` exposes the assistant message.
Setting `event.cancel` to a reason returns error results for the whole batch. A
`BeforeToolCallEvent` guard on just the writer is too late to establish that no sibling
reader ran. [The example](../scripts/batch-guard.mjs) is tested through a real Agent
with a scripted model, not merely by calling the predicate directly.

This rule assumes the listed writers share state with the readers. Do not serialize
independent tools just because one writes somewhere. Cross-invocation concurrency
still needs revision checking, locking, or another host-level consistency strategy.

## Admission, cancellation and settlement are different

Check an explicit limit before dispatch. Count retries, fallback and repair work in
the same job allowance; reserve capacity for essential finishing work where needed.
A post-call counter cannot prevent the call it just counted. An input-token estimate
is useful for admission but is not a provider invoice or an exact dollar guarantee.

For a shared budget, make reservation atomic across concurrent workers. Record
reservation, dispatch and settlement separately. A provider rejection with evidence
of no consumption differs from a connection dying after dispatch with unknown usage.
Keep unknown usage unknown; reconcile it later if the provider supplies receipts.

Honor the operator's limits. Do not invent a universal step cap or silently remove
an existing one. Return the partial result and stopping reason when the allowance
is exhausted. A failed progress listener should not necessarily fail computation;
a failed authorization or budget check must not be swallowed as mere telemetry.

Cancellation is not proof the remote operation stopped. Thread the supported abort
signal into cancellable tools, close transports, and reconcile remote job state.
Avoid blindly retrying a side-effecting tool after an uncertain timeout.

## Meter the right surface

The 1.13.0 field collector used hooks for call counts and progress, then read token
usage from `result.metrics.latestAgentInvocation.usage`. It did not infer billed
tokens from hook frequency. New SDK event surfaces can differ: inspect the installed
event type before claiming hooks never carry usage.

Provider usage also needs semantic reconciliation. In a later accounting investigation,
cached input was a subset of prompt input, while thinking and tool-use prompt tokens
needed explicit handling. Adding a cache subset to the total again double-counts it;
dropping reasoning usage undercounts it. Retain the provider's raw total separately
from your normalized fields and test reconciliation with the actual adapter's schema.
Do not assume every provider's token categories are disjoint or identically named.

## Sources

- [Batch guard and design rationale](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/concurrency.ts)
- [Budget implementation](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/call-budget.ts)
- [Field metrics collector](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/hooks.ts)
- [Current hook lifecycle](https://strandsagents.com/docs/user-guide/concepts/agents/hooks/)
