# Example 03 — Failure Case (Skill Name Already Exists)

## Invocation
`/skill-scaffold`

## Context
User tries to scaffold a skill with a name that already exists in `.claude/skills/`.

## Expected Inputs Provided
- `skill-name`: `skill-scaffold`
- `description`: (provided)

## Expected Behaviour
Before writing any files, the skill checks whether `.claude/skills/skill-scaffold/` already exists. It detects that it does and asks the user whether to:
1. Overwrite the existing skill
2. Choose a different name

It does not overwrite silently under any circumstances.

If the user says "no, don't overwrite", the skill exits cleanly with no files changed.

## Pass Criteria
- User is prompted before any file is overwritten
- If user declines, no files are modified
- If user confirms overwrite, all 4 files are recreated cleanly
