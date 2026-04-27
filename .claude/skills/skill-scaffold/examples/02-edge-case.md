# Example 02 — Edge Case (Missing Required Inputs)

## Invocation
`/skill-scaffold`

## Context
User provides only the skill name, no other information.

## Expected Inputs Provided
- `skill-name`: `player-report`
- (nothing else)

## Expected Behaviour
Skill recognises that `description` is required and has not been provided. It asks for the missing required inputs before writing any files. It does not guess or invent content for the missing fields.

Questions asked (all before writing):
1. "What should this skill do, and when should it be invoked? (one sentence)"
2. "What inputs does the skill need from the user?"
3. "What are the numbered workflow steps?"
4. "Which Claude tools does the skill need?"

## Pass Criteria
- No files are created until all required inputs are confirmed
- Questions are clear and collected before any write operation
- Final spec is confirmed with the user before writing begins
