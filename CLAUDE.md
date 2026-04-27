# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Busche Academy Basketball web application - a monorepo containing a React frontend and Spring Boot backend for managing basketball team information, roster, staff, and game schedules.

## Development Commands

### Frontend (busche-basketball-frontend/)
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Backend (basketball-backend/)
```bash
./mvnw spring-boot:run   # Start dev server (http://localhost:8080)
./mvnw clean install     # Build
./mvnw test              # Run tests
./mvnw package           # Create JAR
```

On Windows, use `mvnw.cmd` instead of `./mvnw`.

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios
- **Backend**: Spring Boot 3.5, Java 17, PostgreSQL, Spring Security, Spring Data JPA
- **Storage**: AWS S3 for images (staff/players/)

### Backend Structure (basketball-backend/src/main/java/org/buscheacademy/basketball/)
- `admin/` - Admin CRUD controllers (AdminGameController, AdminPlayerController, AdminStaffController, AdminTeamController)
- `api/` - Public API controller (PublicController)
- `auth/` - JWT authentication (JwtService, JwtAuthenticationFilter, AuthController)
- `config/` - Security, S3, CORS configuration
- `dto/` - Request/Response DTOs
- `game/`, `player/`, `staff/`, `team/`, `user/` - Domain entities, services, repositories
- `common/` - BaseEntity with created_at/updated_at timestamps

### Frontend Structure (busche-basketball-frontend/src/)
- `api/` - Axios clients: client.ts (base), authApi.ts, publicApi.ts, admin*Api.ts
- `auth/` - AuthContext (React Context for JWT auth state)
- `pages/` - Route components (HomePage, RosterPage, SchedulePage, StaffPage, AdminDashboardPage, etc.)
- `components/` - Admin managers (AdminRosterManager, AdminScheduleManager, AdminTeamManager)
- `types.ts` - Shared TypeScript interfaces

### API Routes
- `/auth/**` - Authentication (login)
- `/public/**` - Public read endpoints (teams, games, staff, roster)
- `/admin/**` - Protected CRUD endpoints (requires JWT)

### Authentication Flow
1. Login via `/auth/login` returns JWT token
2. Frontend stores token in localStorage (`authToken`, `busche_bb_auth`)
3. AuthContext provides auth state to React components
4. Axios interceptor attaches Bearer token to admin API requests
5. Backend JwtAuthenticationFilter validates token on protected routes

## Environment Configuration

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

### Backend (application.properties via env vars)
Required environment variables:
- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET` - JWT signing key
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - S3 credentials
- `APP_S3_BUCKET_NAME` / `APP_S3_REGION` - S3 bucket config

## Key Patterns

- **DTOs**: Backend uses request/response DTOs, not raw entities in controllers
- **TeamLevel enum**: Teams are either REGIONAL or NATIONAL
- **Image uploads**: Go to S3 (`staff/`, `players/` prefixes), URLs stored in entity fields
- **Tailwind colors**: primary (#009FFD), charcoal (#264653), aqua (#2AFC98)
- **No form library**: Admin forms use React useState for form state

## Non-Negotiables

These rules apply to every change, regardless of what was asked:

1. **Only implement what was explicitly requested.** No extra features, no opportunistic refactors, no docstrings on unchanged code.
2. **No placeholders.** Code must compile and run. If something is unknown, surface the risk and propose options — do not stub it.
3. **No `/api` prefix on routes.** The convention is `/auth/**`, `/public/**`, `/admin/**` directly — no nesting under `/api`.
4. **Never leak secrets.** List environment variable names only — never values. New config goes in `application.properties` using `${ENV_VAR:default}`.
5. **Always provide verification steps.** Every code change must include exact commands to run and a short manual smoke checklist.
6. **Schema is Hibernate-managed.** Never create SQL migration files. Add or change `@Column` annotations on JPA entities — Hibernate handles the DDL on startup.
7. **S3 for all images.** Never write media files to the local filesystem. All image uploads go to S3 under `staff/` or `players/` prefix.

## Product UX Invariants

These flows must never be broken, regardless of what is being changed:

1. **Public pages work without login.** `/`, `/roster`, `/schedule`, `/staff`, `/about` must be fully accessible without a JWT token.
2. **Admin data never leaks to public endpoints.** `/public/**` routes must only return data intended for unauthenticated users. Admin write operations are always behind `/admin/**`.
3. **Image uploads go to S3 only.** The `PlayerImageStorageService` and staff upload path both write to S3. This must never be changed to local storage.
4. **TeamLevel is a closed enum.** Valid values are `REGIONAL` and `NATIONAL` only. No other values should be accepted or introduced.

## Claude Code Setup

This repo has a layered Claude Code configuration in `.claude/`.

### Agents (`.claude/agents/`)

Invoke agents by name when delegating work. The default pipeline is:
`orchestrator` → specialist builder(s) → `quality-gate` → `code-reviewer`

| Agent | Role | Universal / Adapted |
|---|---|---|
| `orchestrator` | Plans work, delegates to specialists, never writes code | Universal |
| `quality-gate` | Validates scope, consistency, safety after any change | Universal |
| `code-reviewer` | Read-only PR-style review (Must-fix / Should-fix / Nice-to-have) | Universal |
| `security-auth-reviewer` | JWT, CORS, OWASP review on auth-touching changes | Universal |
| `devops-deploy` | Build errors, env vars, CORS, deployment issues | Universal |
| `spring-backend-builder` | All `basketball-backend/` changes — Spring Boot 3.5, Java 17 | Adapted for this repo |
| `react-vite-frontend-builder` | All `busche-basketball-frontend/` changes — React 19 + Vite | Adapted for this repo |
| `ux-ui-tailwind` | Layout, Tailwind utilities, responsive styling | Universal |

### Skills (`.claude/skills/`)

Invoke skills with `/skill-name`.

| Skill | Invocation | Purpose |
|---|---|---|
| `skill-scaffold` | `/skill-scaffold` | Creates a new skill (SKILL.md + 3 examples) in this repo |
| `basketball-cookbook-adapter` | `/basketball-cookbook-adapter` | Adapts an external pattern or reference to this repo's conventions |

## Output Requirements

Every code change Claude makes must include these five sections:

1. **Acceptance criteria satisfied** — bullet list of what was asked and confirmed done
2. **Files changed** — list of paths and what changed in each
3. **How to test** — exact CLI commands to build/run/verify
4. **Manual smoke checklist** — short list of browser/curl steps to confirm it works end-to-end
5. **Risks / edge cases** — anything that could break or needs follow-up
