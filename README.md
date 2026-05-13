# Hello World-May-13

A simple greeting application demonstrating basic web functionality.

## Local Development

This project is organized as a multi-service architecture:

**Services:**
- `hello-world-may-13-ui/` — frontend-app (TypeScript, React)
- `hello-world-may-13-backend/` — backend-service (Node.js, Express)

### Prerequisites

- Docker & Docker Compose (recommended for local dev)
- OR language runtimes directly:
  - Node.js ≥ 18 (use [nvm](https://github.com/nvm-sh/nvm))
  - pnpm (`npm install -g pnpm`)

### Quick Start (with Docker — recommended)

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker compose up --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

Service URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Setup for Local Development (without Docker)

**Frontend (`hello-world-may-13-ui/`):**
```bash
cd hello-world-may-13-ui
npm install
npm run dev
```

**Backend (`hello-world-may-13-backend/`):**
```bash
cd hello-world-may-13-backend
pnpm install
pnpm dev
```

### Component Library (MANDATORY)

**All UI components MUST use MUI (Material-UI) latest.**

This project enforces a single component library to ensure design consistency:
- Library: **MUI** (Material-UI) latest
- Design tokens: see `.design-tokens.json`

When developing UI:
1. Use ONLY MUI components — no custom CSS-only components
2. Reference design tokens from `.design-tokens.json` for colors, fonts, spacing, radius
3. Do NOT use alternative UI libraries (Bootstrap, Tailwind standalone, etc.)

### Design System

Design tokens are defined in `.design-tokens.json`:
- **Primary:** `#20e811`
- **Accent:** `#0FA4AF`
- **Surface:** `#AFDDE5`
- **Fonts:** Inter (display/body), JetBrains Mono (code)
