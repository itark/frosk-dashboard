# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server on http://localhost:3000
npm run build      # Production build (uses increased Node memory stack)
npm test           # Run Jest tests
npm run stop       # Kill process on port 3000
```

The `start.sh` script in the root also starts the dev server with `--max-old-space-size=1024`.

## Architecture

This is a React 18 SPA dashboard ("Frosk") deployed at `/frosk`. It connects to a backend API at `http://localhost:8080` (configured in `src/config.js`).

**Key config**: `src/config.js` — controls `basename` (URL prefix), `defaultPath`, and the backend API base URL. This file is often modified per environment.

**Routing**: React Router v6. Routes are split into `MainRoutes.js` (dashboard pages) and `AuthenticationRoutes.js` (login/register), rendered via `src/routes/index.js`.

**State**: Redux manages only UI customization (theme, layout preferences) — see `src/store/customizationReducer.js`.

**Layouts**:
- `MainLayout` — full dashboard shell with sidebar and header, wraps all protected pages
- `MinimalLayout` — bare wrapper for auth pages

**Pages** live in `src/views/`:
- `frosk-page/` — securities/metadata display, fetches from backend `/metadata`
- `strategies-page/` — investment strategies
- `index-page/` — indices data
- `dashboard/Default/` — main dashboard

**API calls** go through utilities in `src/utils/`. The backend base URL is imported from `src/config.js`.

**Path aliases**: `jsconfig.json` sets `baseUrl: "src"`, so imports like `import Foo from 'components/Foo'` resolve relative to `src/`.

## Stack

React 18, Material-UI v5, Redux, React Router v6, ApexCharts + lightweight-charts, Formik/Yup, create-react-app (react-scripts v5).
