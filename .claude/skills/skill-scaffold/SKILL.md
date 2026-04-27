---
name: skill-scaffold
description: Creates a new Claude skill in this repo. Writes SKILL.md + 3 example files to .claude/skills/<name>/. Use when you want to encode a repeatable workflow as an invocable skill.
allowed-tools:
  - Read
  - Glob
  - Write
---

# Skill Scaffold

## Instructions

This skill creates the full directory and file structure for a new Claude skill in this repo. It writes the canonical SKILL.md template and three example files under `.claude/skills/<name>/`. It does not write application code — skills are workflow definitions, not implementations.

## Inputs

| Input | Required | Notes |
|---|---|---|
| `skill-name` | Required | Kebab-case name (e.g. `export-stats`) |
| `description` | Required | One sentence: what does this skill do and when should it be invoked? |
| `allowed-tools` | Optional | List of Claude tools this skill needs. Ask if not provided. |
| `inputs` | Optional | What inputs does the skill require from the user? Ask if not provided. |
| `workflow-steps` | Optional | The numbered steps of the workflow. Ask if not provided. |

If any required input is missing, ask for it before writing any files.

## Workflow

1. Collect all required inputs. Confirm the full specification with the user before writing.
2. Check whether `.claude/skills/<skill-name>/` already exists. If it does, ask before overwriting.
3. Create `.claude/skills/<skill-name>/SKILL.md` using the canonical template below.
4. Create `.claude/skills/<skill-name>/examples/01-happy-path.md`
5. Create `.claude/skills/<skill-name>/examples/02-edge-case.md`
6. Create `.claude/skills/<skill-name>/examples/03-failure-case.md`
7. Report the files created and the invocation phrase.

## Canonical SKILL.md Template

```
---
name: <skill-name>
description: <description>
allowed-tools:
  - <tool>
---

# <Skill Name>

## Instructions
<One paragraph scope statement.>

## Inputs
| Input | Required | Notes |
|---|---|---|
| <input> | Required/Optional | <description> |

## Workflow
1. <Step 1>
2. <Step 2>
3. <Step 3>

## Output Format
<Exact format Claude must produce when this skill completes.>

## Do
- [ ] <Rule>

## Don't
- [ ] <Anti-pattern to avoid>

## Acceptance Criteria
- Happy path: <description>
- Edge case: <description>
- Failure case: <description>

## Definition of Done
- [ ] All required inputs collected and confirmed
- [ ] All specified files created or updated
- [ ] Output format matches template exactly
- [ ] No application code written
```

## Output Format

Report exactly:
```
Files created:
- .claude/skills/<name>/SKILL.md
- .claude/skills/<name>/examples/01-happy-path.md
- .claude/skills/<name>/examples/02-edge-case.md
- .claude/skills/<name>/examples/03-failure-case.md

Invocation phrase: /<skill-name>
Next step: [what the user should do to test it]
```

## Do
- [ ] Collect all inputs before writing any file
- [ ] Confirm the full spec with the user before writing
- [ ] Follow the canonical template exactly
- [ ] Keep SKILL.md generic enough to be usable by any future contributor

## Don't
- [ ] Write application code
- [ ] Skip the confirmation step before writing files
- [ ] Invent inputs or workflow steps that were not agreed upon
- [ ] Overwrite an existing skill without asking

## Acceptance Criteria
- Happy path: User provides name, description, and workflow → 4 files created in correct structure
- Edge case: User provides only a name → skill asks for missing inputs before proceeding
- Failure case: `skill-name` already exists → user is asked before any file is overwritten

## Definition of Done
- [ ] `.claude/skills/<name>/SKILL.md` created
- [ ] `.claude/skills/<name>/examples/01-happy-path.md` created
- [ ] `.claude/skills/<name>/examples/02-edge-case.md` created
- [ ] `.claude/skills/<name>/examples/03-failure-case.md` created
- [ ] Files created list and invocation phrase reported to user
