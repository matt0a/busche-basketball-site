# Example 01 — Happy Path

## Invocation
`/basketball-cookbook-adapter`

## Context
User wants to add a "top scorers" leaderboard to the public schedule page, adapted from a generic REST + React list pattern.

## Expected Inputs Provided
- `target-area`: both
- `feature-request`: Add a `/public/players/top-scorers` endpoint and display the results on `SchedulePage`

## Expected Behaviour

1. Skill searches `PlayerService`, `PublicApiController`, `SchedulePage.tsx`, `publicApi.ts`, and `src/types.ts` for existing patterns.
2. Produces Pattern Mapping:

| Source Concept | Basketball App Equivalent |
|---|---|
| `GET /api/players?sort=points` | `GET /public/players/top-scorers` (no `/api` prefix) |
| Generic list DTO | Existing or new DTO in `dto/` |
| Redux state for list | `React.useState` + `useEffect` (no state library) |
| Separate `LeaderboardComponent` | Inline JSX in `SchedulePage` (minimal new files) |

3. Lists files to change: `PlayerService.java`, `PublicApiController.java`, `publicApi.ts`, `SchedulePage.tsx`, `src/types.ts` (if new type needed)
4. Asks for user confirmation before writing.
5. Implements following all conventions: route is `/public/players/top-scorers`, response is a DTO, frontend calls `publicApi.ts`, no raw entity exposed.

## Pass Criteria
- Route has no `/api` prefix
- Response uses a DTO, not a raw `Player` entity
- Frontend calls `publicApi.ts` (not `adminPlayerApi.ts`)
- No new npm or Maven dependencies added
- `src/types.ts` updated if a new interface was needed
