# Example 01 — Happy Path

## Invocation
`/skill-scaffold`

## Context
User wants to create a new skill for exporting team stats to CSV given a team ID.

## Expected Inputs Provided
- `skill-name`: `export-team-stats`
- `description`: Exports a team's player stats to a CSV file given a team ID and optional season filter.
- `allowed-tools`: Read, Glob, Write
- `inputs`: team-id (required), season (optional, defaults to current season)
- `workflow-steps`: Validate team ID exists → fetch player stats → format as CSV → write file → report path

## Expected Output

```
Files created:
- .claude/skills/export-team-stats/SKILL.md
- .claude/skills/export-team-stats/examples/01-happy-path.md
- .claude/skills/export-team-stats/examples/02-edge-case.md
- .claude/skills/export-team-stats/examples/03-failure-case.md

Invocation phrase: /export-team-stats
Next step: invoke /export-team-stats with a team ID to test it
```

## Pass Criteria
- All 4 files created under `.claude/skills/export-team-stats/`
- `SKILL.md` follows the canonical template exactly
- No application code written
- User confirmed the spec before any file was created
