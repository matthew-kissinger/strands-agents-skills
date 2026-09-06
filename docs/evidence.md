# Evidence and version scope

Research date: 2026-09-06. These are engineering lessons extracted from an application
history, not a complete SDK manual or a claim of exhaustive provider testing.

## Source hierarchy

1. Public code and behavioral tests establish inspectable implementation facts.
2. Maintainer-owned private code, runbooks and session records establish historical
   observations. Their raw contents are not published here.
3. Current official docs establish supported interfaces and provide update references.
4. Offline tests in this repository establish only the behavior they exercise.

The research sampled Codex and Claude Code history on Windows, Hermes history on the
hub, hub Codex sessions, architecture notes and GitHub/local commit history. Old hub checkouts were
treated as historical. Professional notes without suitable public evidence were not
turned into employer-specific examples or production claims.

## Lesson ledger

| Lesson | Inspectable source | Boundary |
| --- | --- | --- |
| Missing stream start | [stream-start.ts](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/stream-start.ts) | Historical V3 adapter defect; not every provider |
| V3 compatibility, routing and reasoning | [providers.ts](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/providers.ts) | Adapter/model-specific semantics |
| Reject mixed writer batches | [concurrency.ts](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/concurrency.ts) | One invocation with shared mutable state |
| Preserve tool pairing during media pruning | [compaction.ts](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/compaction.ts) | Retention must match the user's task |
| Usage and admission | [hooks.ts](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/hooks.ts) | Estimates differ from measured settlement |
| Tool-image rewriting | [adapter](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/agent/split-tool-result-images.ts) | Selected endpoint only |
| Shared contracts | [registry](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/tools/registry.ts) | Adapters retain intentional differences |
| Trace-content review | Private service ADR and pinned SDK inspection | Historical privacy decision; no blanket tracing ban |

The historical dependency baseline was Strands TypeScript 1.13.0, AI SDK provider
3.0.14 and OpenRouter adapter 2.10.0 (the original stream-start comment records 2.9.0).
The current-registry check found Strands 1.16.0. See [validation](validation.md) for
the exact versions exercised here. Python API/production parity is not asserted.

## Changes made during refinement

- Removed claims that official docs lack TypeScript support or that other skills only restate quickstarts.
- Kept sequential tools and structured output as legitimate alternatives.
- Bounded bridge/media fixes by provider and version.
- Distinguished token projections, returned usage and uncertain transport outcomes.
- Kept task-relevant comparison images instead of blindly retaining only the newest.

This collection republishes generalized knowledge and small examples. Raw transcripts,
private operational identifiers and customer data remain outside the repository.
