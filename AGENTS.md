# Repository Guidelines

## Project Structure & Module Organization
This repository uses Feature-Sliced Design (FSD) inside `src/`.

Layers:
- `app/` wires the application together: `App.tsx`, router, providers, store, and global styles.
- `pages/` contains route screens for `/`, `/playlists`, `/tracks`, `/profile`, `/oauth/callback`, and the fallback page.
- `widgets/` contains composed UI blocks such as `header`, `playlists-list`, `playlist-skeleton`, `tracks-list`, and `loading-trigger`.
- `features/` contains user actions like `login`, `create-playlist`, and `edit-playlist`.
- `entities/` contains domain slices such as `session`, `playlist`, and `track`.
- `shared/` contains reusable infrastructure: API base setup, routing, constants, hooks, socket helpers, utilities, UI components, and assets.

Use the `@/` alias for imports instead of deep relative paths.

## FSD Layer Rules

Layers from top to bottom:

app  
pages  
widgets  
features  
entities  
shared

A layer may only import from layers **below it**.

Allowed examples:

pages → widgets, features, entities, shared  
widgets → features, entities, shared  
features → entities, shared  
entities → shared

Forbidden examples:

shared → features  
entities → features  
features → pages

Never break the FSD import direction.

---

## Feature Structure

A typical feature should follow this structure:

src/features/<feature-name>/

ui/
  FeatureComponent.tsx

model/
  slice.ts
  selectors.ts
  types.ts

api/
  featureApi.ts

Responsibilities:

- `ui/` — React components and view logic
- `model/` — business logic, selectors, state, schemas
- `api/` — API requests and RTK Query endpoints

Do not mix responsibilities across these folders.

---

## Entity Structure

Entities represent core domain objects.

Example:

src/entities/<entity-name>/

api/
  entityApi.ts

model/
  entitySchema.ts
  selectors.ts

Entities may be used by **features, widgets, and pages**.

---

## Code Generation Rules

When generating or adding new code:

- place React components inside `ui/`
- place state and business logic inside `model/`
- place API logic inside `api/`
- follow the existing folder structure
- inspect nearby files before creating new ones

Do not:

- create components directly inside `src/`
- create new folders like `components/`, `services/`, or `utils/` outside the FSD layers
- duplicate shared logic inside feature folders

Always prefer extending the existing architecture.

---

## Build, Test, and Development Commands
- `pnpm dev` runs the Vite dev server.
- `pnpm build` runs `tsc -b` and creates the production bundle.
- `pnpm lint` runs ESLint across `.ts` and `.tsx` files.
- `pnpm preview` serves the production build locally.

There is no test runner configured yet, so `pnpm lint` and `pnpm build` are the required checks before a PR.

## Coding Style & Naming Conventions
- TypeScript runs in strict mode; keep types explicit around API responses and forms.
- No formatter is configured. Preserve the style of the file you edit.
- Use `PascalCase` for components and folders in `ui/`, `camelCase` for hooks and helpers, and `UPPER_SNAKE_CASE` for constants like `AUTH_KEYS` and `SOCKET_EVENTS`.
- Keep styles next to the component as `ComponentName.module.css`.
- Follow the FSD import direction described above.

## Architecture Notes
- Shared HTTP setup lives in `src/shared/api/`: `baseQuery` adds `Authorization` and `API-KEY`, and `baseQueryWithReauth` refreshes tokens through `auth/refresh` using `async-mutex`.
- Add entity endpoints through `baseApi.injectEndpoints(...)` and validate responses with `withZodCatch(...)` plus Zod schemas from the same entity.
- `entities/playlist/api/playlistsApi.ts` listens to Socket.IO playlist events and updates RTK Query cache.
- `entities/track/api/tracksApi.ts` uses `build.infiniteQuery(...)` for cursor pagination.
- `features/login/ui/Login.tsx` starts OAuth in a popup and expects the callback page to post `code` back to the opener.

## Commit & Pull Request Guidelines
Use Conventional Commits: `type(optional-scope): description`.

- Preferred types here: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`.
- Use scopes that match slices or layers, for example `feat(playlist): ...` or `refactor(shared-api): ...`.
- Add `BREAKING CHANGE:` in the footer, or `!`, for incompatible changes.

Keep PRs focused. Call out FSD moves separately from behavior changes, list new env vars, and attach screenshots for UI changes.

## Configuration Notes
Environment variables are read from `.env` and `.env.local`: `VITE_BASE_URL`, `VITE_API_KEY`, `VITE_SOCKET_URL`, and `VITE_DOMAIN_ADDRESS`. Do not commit real secrets.
