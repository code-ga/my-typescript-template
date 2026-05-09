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
- Configured Husky with a `pre-commit` hook to automate checks while allowing developers to choose which files to commit:
  - `bun typecheck`: Runs TypeScript compiler checks across all packages.
  - `bunx lint-staged`: Runs linting and formatting **only on staged files** (uses Biome for backend and ESLint for frontend).
  - `bun db:generate`: Generates database migrations in the backend if needed.
- Removed `git add .` from the hook to give the developer full control over what is staged in the final commit.
- Updated root `package.json` to use `--if-present` and `--elide-lines=0` for all filtered commands.

## Future Updates & Ideas
- Update environment variables configuration in frontend. Currently it seems to have remnants of Vite (`import.meta.env`) but uses Next.js (`process.env.NEXT_PUBLIC_...`).
- Verify if any WebSocket proxying needs adjustments for ElysiaJS or Next.js HMR.
- Verify Elysia backend correctly parses requests from the Nginx proxy if client IPs are needed.

## Notes & Warnings
- When adding new services or changing ports, update Nginx configuration accordingly.
- Be careful with `import.meta.env` usage in Next.js code.
