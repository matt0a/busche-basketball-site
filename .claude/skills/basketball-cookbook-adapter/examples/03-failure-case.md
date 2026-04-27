# Example 03 — Failure Case (Source Pattern Violates Repo Conventions)

## Invocation
`/basketball-cookbook-adapter`

## Context
User pastes in a reference pattern that uses `/api/games` as the route prefix and a Flyway SQL migration to add a new `venue` column to the games table.

## Expected Inputs Provided
- `target-area`: backend
- `feature-request`: Add a "venue" field to games using this reference
- `source-pattern`: (paste containing `@RequestMapping("/api/games")` and `V2__add_venue_column.sql`)

## Expected Behaviour
Skill identifies two convention violations in the source pattern and surfaces them before writing anything:

**Violation 1 — Route prefix:**
> This repo uses `/admin/games` and `/public/games` directly. There is no `/api` prefix. The reference's `/api/games` path cannot be used as-is.

**Violation 2 — SQL migration:**
> This repo uses Hibernate `ddl-auto=update`. Schema changes are made by adding `@Column` to the JPA entity — not by creating migration files. A `V2__add_venue_column.sql` file should not be created.

Skill then proposes the corrected basketball-app approach:
1. Add `venue` field to `Game.java` with `@Column(name = "venue")`
2. Add `venue` to `GameRequest` and `GameResponse` DTOs in `dto/`
3. Update `GameService` to map the field
4. Update `AdminGameController` (PUT `/{id}`) to accept the new field
5. Hibernate will add the column on next app startup — no SQL needed

Skill asks for user confirmation of the corrected approach before writing any code.

## Pass Criteria
- Both violations are flagged clearly before any file is written
- Correct conventions are explained (route prefix, Hibernate DDL)
- Corrected implementation approach is proposed
- No code is written until the user confirms the corrected approach
- The final implementation has no `/api` prefix and no SQL migration file
