# Strands Agents Skills

Debug the boundaries of a real Strands tool loop.

[![Validate](https://github.com/matthew-kissinger/strands-agents-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/matthew-kissinger/strands-agents-skills/actions/workflows/validate.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Small, installable skills for coding agents, with source-linked reasoning and offline
examples. Derived from building, debugging and retiring the hosted version of
[Kiln](https://github.com/matthew-kissinger/kiln), then checked against current docs.
No Kiln installation, model key or AWS account is needed for the offline checks.
This is an independent community project.

## Install

Run from the project where you want the skills:

```sh
npx skills@1.5.23 add matthew-kissinger/strands-agents-skills
```

Select the skills and agents you use. Installation is project-scoped by default.
The CLI version is pinned to the release-tested installer. See
[installation options](docs/install.md) for individual skills, Codex, Claude Code,
Hermes, manual copies and release pinning.

## Skills

| Skill | Useful for |
| --- | --- |
| [`strands-agents`](skills/strands-agents/SKILL.md) | Provider bridges, shared-state tools, transcript media, budgets and telemetry. |
| [`agent-tool-design`](skills/agent-tool-design/SKILL.md) | One tool contract across SDK, MCP and CLI, with deliberate completion semantics. |

Try a request such as:

> A Strands tool loop fails after response-metadata with "Stream ended without completing a message". Diagnose the adapter boundary before changing the prompt.

The skill helps the agent choose a small diagnostic experiment, preserve the relevant
invariant and explain which versions apply. It does not automatically provision
infrastructure or install a new framework.

## Why this collection

- Specific failure mechanisms and conditions for removing workarounds after upgrades.
- Focused references loaded only when a task needs them.
- Offline examples that test behavior rather than matching documentation wording.
- Clear separation of historical field evidence, current docs and local tests.

Read [evidence and versions](docs/evidence.md), [related work](docs/comparison.md)
and [validation results](docs/validation.md). Historical observations are not
universal claims about every SDK, provider or AWS configuration.

## Develop

```sh
git clone https://github.com/matthew-kissinger/strands-agents-skills.git
cd strands-agents-skills
npm ci --ignore-scripts
npm run check
```

Node.js 22+ runs checks. Python 3.10+ is needed only for per-skill ZIPs:
`npm run package`. See [CONTRIBUTING.md](CONTRIBUTING.md) for adding lessons and
tests. Download individual bundles from [Releases](https://github.com/matthew-kissinger/strands-agents-skills/releases).

Companion: [agentcore-skills](https://github.com/matthew-kissinger/agentcore-skills).
MIT licensed. By [Matthew Kissinger](https://github.com/matthew-kissinger).
