# 08 - Development Setup

## Prerequisites

| Requirement | Version            | Notes                                  |
| ----------- | ------------------ | -------------------------------------- |
| Node.js     | v24+ or latest lts | Use nvm or vfox for version management |
| pnpm        | v10+ or latest     | Required for workspace management      |
| Git         | latest             | For version control and CI/CD          |
| Code Editor | Any                | Neovim                                 |

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/sachinksamad1/ultimate-tic-tac-toe.git
cd ultimate-tic-tac-toe
pnpm install
```

### 2. Configure Environment Variables

**Backend** (`apps/server/.env`):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
LOG_LEVEL=debug
```

**Frontend** (`apps/web/.env`):

```env
PUBLIC_BACKEND_URL=http://localhost:3001
```

### 3. Start Development Servers

```bash
# Start both frontend and backend concurrently
pnpm dev

# Or start individually
pnpm dev:server   # Backend on http://localhost:3001
pnpm dev:web      # Frontend on http://localhost:5173
```

The frontend will be available at `http://localhost:5173` and will automatically proxy API calls to the backend.

## Monorepo Structure

```
ultimate-tic-tac-toe/
├── apps/
│   ├── server/          # Node.js + Express + Socket.io backend
│   └── web/             # SvelteKit frontend
├── packages/
│   └── shared/          # TypeScript interfaces, game engine logic
├── docs/                # Documentation
├── pnpm-workspace.yaml  # Workspace configuration
├── turbo.json           # Turborepo pipeline config
└── package.json         # Root scripts and dependencies
```

## Available Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `pnpm dev`          | Start all apps in dev mode    |
| `pnpm dev:server`   | Start backend only            |
| `pnpm dev:web`      | Start frontend only           |
| `pnpm build`        | Build all apps for production |
| `pnpm build:server` | Build backend only            |
| `pnpm build:web`    | Build frontend only           |
| `pnpm test`         | Run all tests                 |
| `pnpm test:watch`   | Run tests in watch mode       |
| `pnpm test:e2e`     | Run E2E tests                 |
| `pnpm lint`         | Lint all packages             |
| `pnpm format`       | Format all code with Prettier |
| `pnpm typecheck`    | Run TypeScript type checking  |

## Debugging

### Backend Debugging

```bash
# Start with Node inspector
pnpm dev:server --inspect

# Connect via Chrome DevTools
chrome://inspect
```

### Frontend Debugging

- Install **Svelte DevTools** browser extension
- Use browser DevTools Network tab to inspect WebSocket frames
- Enable verbose Socket.io client logging:
  ```typescript
  import { debug } from 'socket.io-client';
  debug.enable('socket.io-client:*');
  ```

### WebSocket Debugging

- Use the **ws** extension for VS Code to inspect connections
- Monitor Socket.io events in browser console with debug enabled
- Backend logs all connection events at `LOG_LEVEL=debug`

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3001
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### pnpm Workspace Not Resolving

```bash
pnpm install --force
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### TypeScript Errors in Shared Package

```bash
pnpm --filter shared build
pnpm typecheck
```

## Development Workflow

1. **Create a feature branch**: `git checkout -b feature/my-feature`
2. **Make changes** in the relevant app or package
3. **Run tests**: `pnpm test`
4. **Lint and format**: `pnpm lint && pnpm format`
5. **Type check**: `pnpm typecheck`
6. **Commit and push**: Follow conventional commit messages
7. **Open a pull request**

## Hot Reload

- **Frontend**: SvelteKit HMR is enabled by default. Changes to `.svelte` files and styles are reflected instantly.
- **Backend**: Uses `tsx` or `nodemon` for automatic restart on file changes in `apps/server/src/`.
- **Shared package**: Changes to `packages/shared/` trigger rebuilds and restart dependent apps.

## Production Build Preview

```bash
# Build for production
pnpm build

# Preview the production build locally
pnpm preview
```
