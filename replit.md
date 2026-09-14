# Student Support Hub

A calm, role-based consultation and counseling workspace for tertiary institutions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Tailwind CSS, shadcn/ui primitives, Wouter

## Where things live

- `artifacts/student-support-hub/src/App.tsx` — the complete role-based frontend and local demo state
- `artifacts/student-support-hub/src/index.css` — visual tokens and responsive styling
- `artifacts/student-support-hub/.replit-artifact/artifact.toml` — web artifact routing and workflow configuration
- `attached_assets/` — source screenshots and product requirements PDF

## Architecture decisions

- The first build is frontend-first and uses seeded local state so every role workflow is immediately reviewable without requiring external service setup.
- The active role switcher is intentionally visible in the product to make the three access boundaries easy to exercise during demos.
- The visual language follows the provided “hush.” references: dark teal navigation, warm parchment surfaces, coral actions, and privacy-forward copy.
- Session notes are separated into student-visible summaries and counselor-private content; administrator views expose operational metadata only.

## Product

- Students can browse counselors, request and cancel sessions, review upcoming/completed appointments, and see their own record summaries.
- Counselors can review requests, approve or reschedule sessions, manage availability, and create private/shared session notes.
- Administrators can review service metrics, manage user access, inspect operational activity, and export reports without seeing private note content.
- Appointment statuses, notes, availability, notification preferences, privacy controls, and the active demo role persist in localStorage.

## User preferences

- No additional preferences recorded.

## Gotchas

- The current build is a functional local prototype, not a production authentication or database layer; replace the demo role switcher with managed authentication before handling real student records.
- The web workflow must be restarted after changing Vite/build configuration so the preview receives the artifact-provided `PORT` and `BASE_PATH`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
