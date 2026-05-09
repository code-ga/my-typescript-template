# Project Description

This is a monolithic repository containing a Next.js frontend and an ElysiaJS backend, using Drizzle ORM and Postgres database, orchestrated via Docker Compose.

## Project Structure
- `/frontend`: Next.js frontend application.
- `/backend`: ElysiaJS backend application.
- `/nginx`: NGINX configuration for reverse proxying requests.
- `docker-compose.yaml`: Docker compose configuration for running Postgres, backend, frontend, and nginx.

## Task Overview

### Nginx Integration
- Created an Nginx reverse proxy to route traffic:
  - `/api/` -> routes to `backend:3001/` (stripping the `/api/` prefix)
  - `/` -> (Optional) routes to `frontend:3000`. Currently commented out in `nginx/nginx.conf`.
- Updated `docker-compose.yaml` to include the Nginx service on port 80.

### Husky & Linting Setup
- Configured Husky with a `pre-commit` hook that triggers `lint-staged`.
- Moved `lint-staged` configuration to `.lintstagedrc.js` to support advanced workflows:
  - **Type Checking**: Runs `bun typecheck` (tsc --noEmit) for the relevant package whenever TypeScript files are staged.
  - **Linting & Formatting**: Uses Biome for backend and ESLint for frontend on staged files.
  - **Database Migrations**: Automatically runs `bun db:generate` in the backend only when database schema files (`backend/src/database/schema/**/*.ts`) are modified.
- This setup ensures that checks are optimized and only run when relevant files change, while still maintaining full project context for type checking.

### Elysia API Endpoints & Testing
- Created an example Elysia API endpoint (`/example`) in `backend/src/modules/example/index.ts`.
- Followed Elysia best practices by isolating route definitions (`index.ts`) and type schemas (`model.ts`) inside the module.
- Standardized the response shape using the shared `baseResponseSchema` from `backend/src/commons/types/index.ts`.
- Registered the `/example` module in the main `backend/src/index.ts` app.
- Added automated unit tests using `bun test` in `backend/src/modules/example/index.test.ts` to ensure stability and validate inputs/outputs.

## Future Updates & Ideas
- Update environment variables configuration in frontend. Currently it seems to have remnants of Vite (`import.meta.env`) but uses Next.js (`process.env.NEXT_PUBLIC_...`).
- Verify if any WebSocket proxying needs adjustments for ElysiaJS or Next.js HMR.
- Verify Elysia backend correctly parses requests from the Nginx proxy if client IPs are needed.

## Notes & Warnings
- When adding new services or changing ports, update Nginx configuration accordingly.
- Be careful with `import.meta.env` usage in Next.js code.
