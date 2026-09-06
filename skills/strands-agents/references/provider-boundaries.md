# Provider boundaries

## A complete response can still be an incomplete SDK message

**Historical observation:** a LanguageModelV3 provider emitted `response-metadata`
without a leading `stream-start`. With the Strands Vercel adapter used by the field
application, the assistant message never acquired its role and the loop ended with
`ModelError: Stream ended without completing a message`.

The provider could return useful text, so changing the prompt obscured the fault.
Inspect ordered event types before blaming model quality. Compare raw adapter
output with the consuming SDK's expected events. A valid finish event cannot undo
a missing start transition.

The original implementation names OpenRouter adapter 2.9.0; the later design baseline
used 2.10.0 and Strands 1.13.0. This is evidence for those paths, not a claim that
every OpenRouter release or non-native provider is broken.

The release tests reproduce this event sequence against the real Strands 1.16.0
Vercel adapter using a synthetic provider. The missing-start case still fails and
the repaired case succeeds. This verifies the SDK boundary, not today's live
OpenRouter stream behavior.

When the defect is reproduced, wrap only `doStream` and prepend the missing start.
Preserve metadata, errors, usage, method binding and the rest of the stream. Do not
fabricate a successful finish for an empty or interrupted response. See
[the narrow repair](../scripts/stream-start.mjs). Remove the repair when an upgrade
passes the unwrapped regression case.

## Types are not protocol adapters

Strands 1.13.0's Vercel integration used `LanguageModelV3`; the application resolved
`@ai-sdk/provider` 3.0.14. Casting a V4 model to V3 does not translate runtime events.
Inspect the SDK's adapter import and resolved peer tree. Pin a compatible set or
write an explicit adapter with a tool-loop test. Do not impose the old major on
unrelated native providers or a newer SDK without checking its actual contract.

## Reasoning consumes the allowance you meant for visible output

One routed provider converted reasoning effort into a fraction of the output budget.
For a 32,000-token combined allowance and an 80% reasoning allocation, only 6,400
tokens remain for visible output. That may be too little for a substantial tool input.
The percentages are a historical routing behavior, not a cross-provider formula.

Read the selected endpoint's current token semantics. Distinguish context window,
requested output limit, reasoning allocation and visible output. Choose a lower
reasoning effort or a supported larger allowance when the visible remainder cannot
fit the task; respect the caller's spending constraints. Preserve the raw finish reason
and usage so an exhausted allowance is not mislabeled as a transport failure.

## Caching is a transport feature

Native Anthropic/Bedrock paths in the field application used a system
`CachePointBlock`. Its routed Anthropic path used a provider-level cache directive
because its bridge did not preserve the block. Do not apply both shapes everywhere.
Check adapter serialization and observed cache read/write usage. Missing cache fields
mean unavailable, not proof of zero hits or support.

## Evidence and current reference points

- [Historical stream repair and rationale](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/stream-start.ts)
- [Provider construction and routing](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/providers.ts)
- [Strands Vercel provider documentation](https://strandsagents.com/docs/user-guide/concepts/model-providers/vercel/)
- [Strands TypeScript source](https://github.com/strands-agents/sdk-typescript)
- [OpenRouter reasoning documentation](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens)

Recheck upstream behavior on dependency changes; links are investigation entry points,
not a claim that today's documentation still omits the historical defect.
