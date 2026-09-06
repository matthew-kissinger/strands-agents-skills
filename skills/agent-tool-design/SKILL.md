---
name: agent-tool-design
description: Design or refactor tool contracts shared by an agent SDK, MCP server or CLI. Use when schemas drift between transports, completion is ambiguous, or tool discovery and output size need redesign. Not a general agent framework selection guide.
license: MIT
metadata:
  author: matthew-kissinger
  version: "0.1.0"
---

# One tool contract, deliberate transport differences

Identify the caller, state owner and completion owner before changing a tool surface.
List the actual transports in use. Preserve existing public contracts unless the user
authorizes their evolution.

Read [contract and completion design](references/contracts.md) for registry boundaries,
terminal actions, discovery, images and transport parity.

## Workflow

1. Choose one source of truth for name, description, input schema and execution.
   Keep the registry independent of a particular agent SDK where practical.
2. Let transport adapters translate that definition. Document intentional differences:
   authentication, result encoding, cancellation and completion ownership.
3. Test what a real client discovers and invokes. A test comparing two projections
   of the same helper can pass while the public transport is broken.
4. Make completion and artifact identity observable. Identify the saved revision or
   result, not merely a successful tool call or the model saying “done.”
5. Return errors that suggest a valid next action. Distinguish unsupported capability,
   temporary failure, invalid input and an uncertain side effect.

For a large surface, prefer bounded search and describe results over placing every
schema in the initial prompt. Keep authorization in execution even if discovery
filters capabilities. A compact discovery surface is not an authorization boundary.
