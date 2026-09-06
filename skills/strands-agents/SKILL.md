---
name: strands-agents
description: Build and debug Strands Agents SDK loops, especially TypeScript provider bridges, concurrent tools, transcript media, budgets and telemetry. Use for Strands implementation or a failing Strands run; not for generic AWS infrastructure or for installing skills inside an agent.
license: MIT
metadata:
  author: matthew-kissinger
  version: "0.1.0"
---

# Strands agents that survive real tool loops

Start with the failing boundary: provider response, SDK event stream, tool execution,
transcript, or host transport. Preserve the user's language, provider and architecture.
Identify the installed SDK and adapter versions from the resolved lockfile before
applying a workaround. The field evidence here comes from TypeScript SDK 1.13.0;
newer versions need a fresh applicability check.

## Choose the relevant reference

| Task or symptom | Read |
| --- | --- |
| First turn fails; Vercel bridge; provider migration; reasoning leaves too little output | [Provider boundaries](references/provider-boundaries.md) |
| Tools race; calls exceed a budget; cancellation or usage accounting is wrong | [Loop control](references/loop-control.md) |
| Repeated images inflate context; an endpoint rejects tool images; trace content leaks | [Transcript and telemetry](references/transcript-and-telemetry.md) |
| Python implementation or translating a TypeScript finding | [Language and version boundaries](references/languages-and-versions.md) |

Read only the matching reference. For ordinary construction, use the official
[quickstart](https://strandsagents.com/docs/user-guide/quickstart/overview/), then
return here if a specific boundary needs investigation.

## Diagnose with the smallest useful experiment

1. Capture the error class, installed versions and sanitized event *types*. Avoid
   dumping request bodies or provider credentials to diagnose an event-shape problem.
2. Reduce to one model turn and one tool round trip. A text-only completion does not
   prove tool compatibility. Keep a conforming-provider control case.
3. Fix the boundary that failed. A retry cannot repair a deterministic stream shape;
   a type cast cannot adapt an incompatible provider protocol.
4. Check the observable invariant: tools that must not run did not run; tool-result
   IDs still pair; a terminal result exists; reported usage is measured or unknown.
5. Report the applicable versions, reproduction and remaining uncertainty. Do not
   turn one model's workaround into a default for every provider.

For offline SDK experiments use [the scripted model](scripts/scripted-model.mjs).
[Batch protection](scripts/batch-guard.mjs) demonstrates the actual hook seam;
[stream-start repair](scripts/stream-start.mjs) isolates the historical bridge defect.
These files are examples to adapt, not instructions to install packages or change
global agent configuration automatically.
