# Validation

Release candidate: 0.1.0. Checked 2026-09-06.

## Executed checks

- Six offline tests, including real Strands 1.16.0 Agent and Vercel adapter execution.
- Mixed writer/reader batches produce two error results without running either tool;
  solo writers and read-only batches still execute.
- A synthetic V3 stream missing `stream-start` fails through the real adapter and
  succeeds with the narrow repair. Conforming, empty and failed streams have controls.
- Skill metadata, relative references and plugin manifests validated.
- Skills CLI 1.5.23 discovered and copied both skills into temporary project paths
  for Codex, Claude Code and Hermes. No global configuration was changed.
- Source/documentation links checked for errors and misleading redirects.
- Per-skill ZIP packaging includes supporting files and license, with checksums.

Tests passed on Windows with Node 24.20.0 and 22.23.1. CI checks Node 22 on Windows and
Linux; consult the linked workflow for actual results on the published revision.

## What these checks do not establish

The synthetic provider reproduces an event contract; it does not prove a current
OpenRouter endpoint still omits that event. No paid model call was made. Python
behavior and a full fresh-agent behavioral benchmark across three hosts were not
run. `evals/scenarios.json` supplies six prompts/rubrics for that evaluation; it is
not represented as an executed benchmark.

Installer path checks establish copied-file compatibility, not equal model behavior.
The small repository validator complements the official skill/plugin validators;
it is not a complete YAML parser or a general-purpose secret scanner.
