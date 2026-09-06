# Contracts across transports

## Registry ownership

A registry can hold the shared definition while adapters expose it as SDK tools,
MCP tools or CLI commands. Keep transport clients out of the registry's import graph.
Otherwise replacing the harness still pulls the old SDK into unrelated consumers.

Do not confuse one definition with identical behavior everywhere. A CLI may write a
file; an MCP tool may return a resource reference; an in-process agent may update a
result sink. Each adapter must preserve the meaning of inputs and outputs.

## Completion belongs to a caller

In a multi-step authoring loop, an explicit submit tool gave the host a validated
final artifact. Over MCP, the host coding agent already held the authored program,
so forcing the same submit step duplicated ownership. Decide who commits the result.

Structured output is a valid option when the chosen provider supports it alongside
the needed tools. Do not declare it universally inferior. Test the complete tool loop,
validation failures and termination; a standalone schema example is insufficient.

Bind review evidence to the exact saved revision. A screenshot of an earlier version
does not validate the bytes returned at completion. Return immutable revision IDs or
hashes when consumers must correlate artifacts, diagnostics and previews.

## Discovery and output size

One field design exposed status, operation search, operation description, operation
execution and resource retrieval. It kept the initial tool surface small while
allowing precise schema lookup. This is an option for a large API, not a required
five-tool architecture for a small service.

Return bounded previews and retrieval handles for large content. Include enough
context to choose whether retrieval matters. Do not silently truncate information
that changes the validity of a result.

## Expensive capabilities and deadlines

Inject a host-owned capability rather than embedding networking and credentials in
a deterministic library. Keep the in-loop deadline separate from background artifact
generation: the former blocks the next model decision. On degradation, return the
actual fidelity/capability used so the model cannot mistake a fallback preview for
evidence the fallback cannot provide.

## Verification

- Discover schemas through the real transport, then invoke a representative tool.
- Check invalid input and structured errors, not only a valid request.
- Confirm a tool's media content survives the client boundary.
- Confirm authorization happens during execution and cannot be bypassed by a cached schema.
- Compare the returned artifact identity with the reviewed identity.

## Public field examples

- [Shared registry](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/tools/registry.ts)
- [Transport parity test](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/src/mcp-parity.test.ts)
- [Small Strands harness](https://github.com/matthew-kissinger/kiln/blob/a71b80c886109193591e9869055c6441579bddec/examples/strands-harness.ts)

The discovery example is a generalized design from the maintainer's former private
service. The public repository demonstrates registry and transport boundaries; it
does not expose that service's implementation.
