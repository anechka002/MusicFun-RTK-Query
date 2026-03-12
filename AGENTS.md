# Repository Guidelines

## Project Structure & Module Organization
Application code lives in `src/`:

- `src/app/` contains app-wide setup: router, store provider, global styles, and `App.tsx`.
- `src/pages/` contains route-level screens such as `main`, `playlists`, `tracks`, `profile`, `oauth-callback`, and `not-found`.
- `src/widgets/` contains composed UI blocks such as `header`, `playlists-list`, `playlist-skeleton`, `tracks-list`, and `loading-trigger`.
- `src/features/` contains user actions, currently `login`, `create-playlist`, and `edit-playlist`.
- `src/entities/` contains business slices with `api/` and `model/`, currently `session`, `playlist`, and `track`.
- `src/shared/` contains reusable segments: `api`, `config`, `lib`, `model`, `ui`, and `assets`.

Use the `@/` alias instead of deep relative imports.

## Build, Test, and Development Commands
- `pnpm dev` starts the Vite dev server with HMR.
- `pnpm build` runs TypeScript project checks and creates a production build in `dist/`.
- `pnpm lint` runs ESLint across the repository.
- `pnpm preview` serves the production build locally for a final smoke check.

Run commands from the repository root and prefer `pnpm`; the repo is locked with `pnpm-lock.yaml`.

## Coding Style & Naming Conventions
This project uses TypeScript strict mode, React 19, RTK Query, Zod, and CSS Modules.

- No formatter is configured. Preserve the style of the file you edit; imports currently mix alias paths and explicit `.ts` extensions.
- Use `PascalCase` for React components and UI folders, `camelCase` for hooks, helpers, and RTK Query endpoints, and `UPPER_SNAKE_CASE` for constants such as `AUTH_KEYS` and `SOCKET_EVENTS`.
- Keep component styles beside the component as `ComponentName.module.css`.
- Keep FSD import direction strict: `app` may import anything below, `pages` may import `widgets/features/entities/shared`, `widgets` may import `features/entities/shared`, `features` may import `entities/shared`, and `shared` must not depend on upper layers.
- Add API endpoints through `baseApi.injectEndpoints(...)` in `src/shared/api/baseApi.ts` and validate responses with `withZodCatch(...)` plus schemas from the owning entity `model/` folder.

## Testing Guidelines
There is no test runner configured yet. For now, `pnpm lint` and `pnpm build` are the required checks before opening a PR. If you add tests, place them next to the feature they cover and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
All new commits must follow the Conventional Commits 1.0.0 specification: `type(optional-scope): description`.

Use this structure:

- `<type>[optional scope]: <description>`
- `[optional body]`
- `[optional footer(s)]`

Use `feat:` for new functionality, `fix:` for bug fixes, and add `BREAKING CHANGE:` in the footer, or `!` after type/scope, for incompatible API changes. Other allowed types include `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, and `test:`. Scopes are optional and should describe the affected area, for example `feat(playlists): add optimistic cache update`.

- `feat(playlists): add optimistic cache update`
- `fix(auth): handle expired token refresh`
- `refactor(api): move shared request logic into baseApi`

Keep pull requests focused. Include a short description, note FSD layer moves separately from behavior changes, list new env vars, link the related issue when available, and attach screenshots for UI work.

## Configuration Notes
The app reads `VITE_BASE_URL`, `VITE_API_KEY`, `VITE_SOCKET_URL`, and `VITE_DOMAIN_ADDRESS` from `.env` or `.env.local`. `baseQuery` sends the API key on every request, and sockets connect through `/api/1.0/ws`. Do not commit real secrets.
