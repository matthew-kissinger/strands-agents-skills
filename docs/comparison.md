# Related work and the intended contribution

Reviewed 2026-09-06. This is a scope comparison, not a performance ranking.

| Resource | What it provides | Where this collection fits |
| --- | --- | --- |
| [Strands documentation](https://strandsagents.com/docs/) | Current SDK concepts, language-specific APIs and examples | Follow it for API construction; use these skills for diagnosing failures across adapter, loop and transcript boundaries |
| [AWS Agent Toolkit](https://github.com/aws/agent-toolkit-for-aws) | AWS-oriented skills and tooling, including agent/service guidance | Complement it when a Strands loop uses a non-Bedrock provider or needs a narrow reproduction |
| [AWSBedrockAgentCoreSkill](https://github.com/ferdinandobons/AWSBedrockAgentCoreSkill) | Broad source-cited routing across Strands, Bedrock, AgentCore and infrastructure | Prefer that breadth for service selection; this collection concentrates on a small set of field failures and testable invariants |
| [AWS sample for Strands Agent Skills](https://github.com/aws-samples/sample-strands-agents-agentskills) | Patterns for loading skills into a running Strands agent | Different job: our skills teach a coding agent to build/debug Strands applications |

The comparison inspected the broader collection's entrypoint plus Strands and Gateway
references. It is not reasonable to call it merely a quickstart restatement. Nor is
TypeScript support absent from current official docs. This collection's contribution
is narrower: reproduce the boundary, explain the failure, bound the claim, and provide
an upgrade/removal condition.

## Packaging decisions

[Vercel's agent-skills](https://github.com/vercel-labs/agent-skills) makes repository
installation prominent and stores independently selectable skills under `skills/`.
[Anthropic's skills](https://github.com/anthropics/skills) also offers a Claude plugin
marketplace. [OpenAI's catalog](https://github.com/openai/skills) demonstrates focused
skill folders suitable for selective installation. We adopt those conventions:

- A short README with an install command and skill table.
- Portable skill folders plus optional host manifests.
- Per-skill release archives, a license and contribution criteria.
- Project-local installation examples; no custom installer or automatic global setup.

We do not claim placement in any catalog or superior results across agents. The
validation report distinguishes installation tests from behavioral evidence.
