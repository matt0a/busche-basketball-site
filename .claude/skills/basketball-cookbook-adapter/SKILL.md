---
name: basketball-cookbook-adapter
description: Use this skill when adding a feature or component to this basketball app by adapting an existing pattern, reference implementation, or cookbook example. Searches the existing codebase first, enforces this repo's real conventions, and asks for confirmation before writing anything.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
---

# Basketball Cookbook Adapter

## Instructions

This skill bridges an external pattern, reference implementation, or cookbook example into this specific basketball app repo. It searches the existing codebase for the closest matching conventions, presents a mapping table, and asks for user confirmation before writing any code. It enforces this repo's real structure and conventions in every adaptation and never silently adopts patterns that violate them.

## Inputs

| Input | Required | Notes |
|---|---|---|
| `target-area` | Required | `backend`, `frontend`, or `both` |
| `feature-request` | Required | What do you want to add or adapt? |
| `source-pattern` | Optional | URL, description, or paste of the reference to adapt. If not provided, skill uses existing codebase patterns only. |

If `target-area` or `feature-request` is missing, ask before proceeding.

## This Repo's Conventions (enforced on every adaptation)

### Backend (`basketball-backend/`)
- Base package: `org.buscheacademy.basketball`
- Routes: `/auth/**`, `/public/**`, `/admin/**` — **NO `/api` prefix — ever**
- Config: `application.properties` with `${ENV_VAR:default}` syntax
- Schema: Hibernate `ddl-auto=update` — **no SQL migration files**
- DI: `@RequiredArgsConstructor` + `final` fields
- Lombok on JPA entities extending `BaseEntity`: `@Getter`/`@Setter`/`@Builder`/`@NoArgsConstructor`/`@AllArgsConstructor` (not `@Data`)
- `StaffMember` (does not extend `BaseEntity`): `@Data` + `@Builder` + `@NoArgsConstructor` + `@AllArgsConstructor`
- DTOs and request objects in `dto/` are Java `record` types — no Lombok on them
- DTOs in `dto/` for all controller I/O — never raw JPA entities
- Images: S3 only, prefixes `staff/` and `players/`

### Frontend (`busche-basketball-frontend/`)
- Framework: React 19 + Vite — **no Next.js patterns** (no `getServerSideProps`, no `app/` directory, no server components)
- Routing: React Router DOM; routes defined in `src/main.tsx`
- API clients: `publicApi.ts` → `/public/**`, `adminXxxApi.ts` → `/admin/**`, `authApi.ts` → `/auth/**`
- `publicApi.ts` uses a TTL cache via `src/lib/ttlCache.ts` (`cachedFetch`). New public endpoints must follow the same `raw` + cached wrapper pattern — do not call axios directly in `publicApi.ts`
- Auth state: `useAuth()` hook from `src/auth/AuthContext.tsx` — not Redux, not Zustand. Interface: `{ isAuthenticated, token, fullName, email, login(resp), logout() }`
- Shared types: `src/types.ts` — no duplicate type definitions
- Local input types (e.g. `PlayerInput`) may be defined in the api file that owns them — check before adding to `src/types.ts`
- Forms: `React.useState` — no form library
- Tailwind tokens: `primary` (#009FFD), `charcoal` (#264653), `aqua` (#2AFC98)

### Separation invariant
- `/admin/**` always requires JWT; `/public/**` always works unauthenticated. Never mix concerns.

## Workflow

1. Require `target-area` and `feature-request` before doing anything else.
2. Search the existing codebase for the closest matching patterns (Glob + Grep the relevant packages and components).
3. If a `source-pattern` was provided, compare it against the repo conventions listed above. Flag any conflicts.
4. If multiple adaptation approaches are possible, present a comparison table and ask the user to choose.
5. Produce a **Pattern Mapping** table: source concept → basketball-app equivalent.
6. List **all** files that will be changed or created.
7. Ask the user to confirm the file list before writing anything.
8. Ask before adding any new dependency (Maven or npm).
9. Implement the adaptation following all repo conventions.
10. Output the required report.

## Output Format

```
### Pattern Mapping
| Source Concept | Basketball App Equivalent |
|---|---|
| <source> | <target> |

### Files Changed
| File | Action | Reason |
|---|---|---|
| <path> | created/updated | <why> |

### Verification Commands
```
# Backend
cd basketball-backend
./mvnw spring-boot:run

# Frontend
cd busche-basketball-frontend
npm run dev
```

### Manual Smoke Checklist
- [ ] <Check 1>
- [ ] <Check 2>
```

## Do
- [ ] Search the existing codebase before writing any code
- [ ] Follow all repo conventions above exactly
- [ ] Ask before touching files outside the declared scope
- [ ] Ask before adding any dependency
- [ ] Preserve admin/public separation in every change
- [ ] Use existing DTOs in `dto/` before creating new ones

## Don't
- [ ] Add `/api` prefix to any route
- [ ] Create SQL migration files — schema is Hibernate-managed
- [ ] Store images locally — S3 only (`staff/` or `players/` prefix)
- [ ] Use Next.js patterns in the frontend
- [ ] Use `@Data` on JPA entities extending `BaseEntity`
- [ ] Expose raw JPA entities from controllers
- [ ] Mix admin and public concerns in the same controller
- [ ] Duplicate type definitions — update `src/types.ts` instead
- [ ] Implement the source pattern as-is if it violates a convention — explain and propose the corrected approach

## Acceptance Criteria
- Happy path: User provides target area + feature → codebase searched → pattern mapped → file list confirmed → adaptation implemented following all conventions
- Edge case: Multiple patterns fit → comparison table shown → user chooses → implementation proceeds with chosen approach
- Failure case: Source pattern uses `/api` prefix or SQL migrations → skill flags the violation, explains the convention, proposes the correct basketball-app approach, and asks for confirmation before proceeding

## Definition of Done
- [ ] `target-area` and `feature-request` were confirmed before writing
- [ ] Existing codebase was searched before writing
- [ ] Pattern Mapping table produced and shown to user
- [ ] File list confirmed with user before writing
- [ ] All repo conventions followed (routes, DTOs, Lombok, S3, auth separation)
- [ ] Verification Commands and Manual Smoke Checklist provided
