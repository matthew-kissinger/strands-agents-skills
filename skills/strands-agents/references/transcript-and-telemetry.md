# Keep the evidence; discard superseded payloads deliberately

## Compact inside tool results

A rendering loop repeatedly sent old images back to the model. The successful
approach replaced superseded media *inside existing tool results* with text markers,
while retaining numeric checks, the newest relevant views, and user reference images.

Protect these invariants:

- Message order and tool-use/result IDs remain paired.
- An error result does not become a success result.
- User-supplied media outside tool results remains intact.
- The model can still retrieve information needed for the current task.
- Repeating compaction does not keep changing the transcript.

Keeping only the latest image was appropriate for one iterative asset. A comparison
task may require several earlier views. Choose retention from the task, not from an
universal `keep=1`. General conversation managers and offloading plugins may already
cover the need; check before adding another history mutator.

## Endpoint rejects an image in a tool message

Use identical small image bytes in two requests: a user message and a tool result.
If only the second fails, investigate the message structure rather than recompressing
the image repeatedly. A model-specific adapter can move unsupported media into a
same-turn user message while preserving the tool result and its pairing.

That changes conversation semantics and can reorder evidence. Test the exact model,
provider route and adapter version, with both accepting and rejecting controls.
Do not rewrite every provider's tool messages to fix one endpoint.

## Trace export is a data boundary

The retired service inspected its pinned Strands telemetry implementation and found
that detailed spans could contain prompts, tool inputs and outputs. It used a small
application-owned span with reviewed fields instead. This was a privacy decision for
that version and application, not a recommendation to disable observability everywhere.

Before enabling a new exporter, plant synthetic canaries in prompt, tool input,
tool output and error text. Capture the actual exported payload locally. Verify that
the intended content-suppression setting removes them, including exception events.
Check nested spans, logs and resource attributes as well as the top-level span.

Runtime health metrics, loop metrics and semantic output quality answer different
questions. None proves the others. A transport success or an automated grade alone
does not prove the generated artifact fulfilled the user's request.

## Sources

- [Media compaction implementation](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/compaction.ts)
- [Endpoint-scoped tool-image adapter](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/split-tool-result-images.ts)
- [Current Strands observability](https://strandsagents.com/docs/user-guide/observability-evaluation/observability/)

The telemetry incident also draws on the maintainer's private service ADR and session
history. Those records are not bundled; this repository makes no public-verification
claim for their production receipts.
