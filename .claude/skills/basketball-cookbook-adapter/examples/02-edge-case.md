# Example 02 — Edge Case (Multiple Patterns Fit)

## Invocation
`/basketball-cookbook-adapter`

## Context
User wants to add image upload for an existing player. The codebase already has two similar upload implementations: `PlayerImageStorageService` and the staff image upload path in `StaffMemberService`.

## Expected Inputs Provided
- `target-area`: backend
- `feature-request`: Add the ability to upload a profile photo for an existing player

## Expected Behaviour
Skill finds two similar patterns and presents a comparison before writing anything:

| Approach | Files | Trade-offs |
|---|---|---|
| Extend `PlayerImageStorageService` | `player/PlayerImageStorageService.java`, `AdminPlayerController.java` | Dedicated service already exists — minimal new code |
| Mirror the staff pattern from `StaffMemberService` | Requires more scaffolding | More explicit but duplicates existing logic |

Skill recommends the first approach (extending the existing service) and asks the user to confirm before proceeding.

Either way, the implementation uses S3 with the `players/` prefix. No local file storage under any circumstances.

## Pass Criteria
- Comparison table presented before any code is written
- User chooses the approach before implementation begins
- Chosen approach stores image on S3 under `players/` prefix
- URL stored in the `Player` entity field, not returned as a local path
