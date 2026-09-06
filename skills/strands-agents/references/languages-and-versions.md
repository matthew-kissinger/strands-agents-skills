# Language and version boundaries

These skills help build *with* Strands. They are not the Strands `AgentSkills` plugin,
which loads skills into a running application agent. See the
[official plugin guide](https://strandsagents.com/docs/user-guide/concepts/plugins/skills/)
when that is the user's request.

## Python

Start with the [Python quickstart](https://strandsagents.com/docs/user-guide/quickstart/)
and installed `strands-agents` version. Preserve Python's provider, tool, hook and
session-manager APIs. TypeScript event names, object constructors and Vercel V3
repairs are not drop-in Python examples.

The transferable questions are: does the stream complete a message, can tools race
over shared state, does history preserve tool pairing, what is persisted, and which
usage is measured? Reproduce those invariants with Python APIs. Do not claim Python
production validation merely because a TypeScript test passed.

## Updating a historical workaround

1. Record SDK, provider adapter and model route from the lockfile/runtime.
2. Run the failing case without the workaround against the proposed upgrade.
3. If the underlying defect is gone, remove the shim and preserve the regression test.
4. If behavior differs, inspect the event contract rather than weakening the test.
5. Record the tested versions and unresolved provider-specific cases.

The original field baseline was Strands TypeScript 1.13.0 and AI SDK provider 3.0.14.
Registry research on 2026-09-06 found Strands 1.16.0. See the repository validation
report for versions actually exercised; a registry version is not a test result.
