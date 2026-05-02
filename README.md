# Ultimate Tic-Tac-Toe

A fullstack, real-time multiplayer implementation of the Ultimate Tic-Tac-Toe variant — a strategically deep 9x9 grid game where every move dictates your opponent's next battlefield.

## Features

- **Real-Time Multiplayer** — Play against opponents anywhere in the world via persistent WebSocket connections
- **Authoritative Server** — All moves validated server-side to prevent cheating and ensure game integrity
- **Client-Side Prediction** — Instant UI feedback with automatic rollback on invalid moves
- **Zero Latency Feel** — Optimistic UI updates keep gameplay smooth even on slow networks
- **Reconnection Support** — Drop out and rejoin within 5 minutes; game state is preserved
- **Responsive Design** — Play on desktop, tablet, or mobile with an adaptive 9x9 grid layout
- **Accessibility First** — Full keyboard navigation, ARIA labels, and `prefers-reduced-motion` support
- **Anonymous Play** — No account required; just connect and start playing

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| **Frontend** | SvelteKit (Svelte 5), Socket.io-client | Vercel |
| **Backend** | Node.js, Express, Socket.io | Railway |
| **Language** | TypeScript (strict mode) | — |
| **Monorepo** | pnpm workspaces, Turborepo | — |
| **Database** | PostgreSQL (optional, persistent) | Railway |
| **CI/CD** | GitHub Actions | — |
| **Testing** | Vitest, Playwright | — |

## Architecture

```
┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (Vercel)  │◄───────►│   Backend (Railway)  │
│   SvelteKit + WS     │  WSS    │  Express + Socket.io │
│   Svelte 5           │         │  Match Manager       │
│   Client Prediction  │         │  Game Engine         │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │   PostgreSQL      │
                                   │   (optional)      │
                                   └───────────────────┘
```

See **[Architecture Diagrams](./docs/diagrams.md)** for detailed Mermaid diagrams covering system architecture, WebSocket event flows, game state machine, and component hierarchy.

## How to Play

Ultimate Tic-Tac-Toe is played on a **9x9 grid** — 9 local boards arranged in a 3x3 global board.

1. **Win a Local Board** — Get three marks in a row, column, or diagonal within any 3x3 board
2. **The "Ultimate" Rule** — Your move determines which board your opponent plays in next (position maps to board)
3. **Free Move** — If sent to a won or full board, you can play anywhere on the entire grid
4. **Win the Game** — Win three local boards in a row on the global board

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | v24+ or latest LTS |
| pnpm | v10+ or latest |
| Git | latest |

### Quick Start

```bash
# Clone the repository
git clone https://github.com/sachinksamad1/ultimate-tic-tac-toe.git
cd ultimate-tic-tac-toe

# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Environment Setup

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

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:server` | Start backend only |
| `pnpm dev:web` | Start frontend only |
| `pnpm build` | Build all apps for production |
| `pnpm test` | Run all tests |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

## Project Structure

```
ultimate-tic-tac-toe/
├── apps/
│   ├── server/              # Node.js + Express + Socket.io backend
│   └── web/                 # SvelteKit frontend
├── packages/
│   └── shared/              # Shared TypeScript types and game engine
├── docs/                    # Architecture docs and implementation tasks
│   ├── architecture/        # Design documentation (01-09)
│   ├── task/                # Implementation roadmap (01-05)
│   └── diagrams.md          # Mermaid architecture diagrams
├── CONTRIBUTING.md          # Contribution guidelines
├── turbo.json               # Turborepo pipeline configuration
├── pnpm-workspace.yaml      # pnpm workspace definition
└── package.json             # Root package with workspace scripts
```

## Documentation

| Document | Description |
|----------|-------------|
| [System Overview](./docs/architecture/01-overview.md) | Vision, architecture, tech stack, deployment strategy |
| [Game Logic](./docs/architecture/02-game-logic.md) | Rules, win conditions, state management, validation flow |
| [Frontend Architecture](./docs/architecture/03-frontend.md) | SvelteKit setup, components, stores, performance, assets |
| [Backend Architecture](./docs/architecture/04-backend.md) | Express, Socket.io events, room management, reconnection |
| [Data Models](./docs/architecture/05-data-models.md) | TypeScript interfaces, domain entities, database schema |
| [Security](./docs/architecture/06-security.md) | Auth model, CORS, rate limiting, input validation, hardening |
| [Testing](./docs/architecture/07-testing.md) | Test strategy, coverage targets, CI integration, fixtures |
| [Development Setup](./docs/architecture/08-development-setup.md) | Prerequisites, env vars, debugging, workflow, hot reload |
| [Troubleshooting](./docs/architecture/09-troubleshooting.md) | Common errors, FAQ, deployment issues, diagnostics |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_match` | Client → Server | Request to join or create a match |
| `make_move` | Client → Server | Attempt to place a mark |
| `match_ready` | Server → Client | Both players connected, game starts |
| `game_update` | Server → Client | Broadcast updated game state |
| `player_left` | Server → Client | Opponent disconnected |
| `error` | Server → Client | Validation or system error |
| `reconnect` | Client → Server | Attempt to rejoin after disconnect |
| `heartbeat` | Bidirectional | Ping-pong for connection health |
| `chat_message` | Both | In-game chat between players |

## Testing

| Layer | Framework | Coverage Target |
|-------|-----------|----------------|
| Unit | Vitest | 90%+ (game engine) |
| Integration | Vitest + Supertest + socket.io-client | 80%+ |
| E2E | Playwright | Critical user journeys |

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:e2e       # E2E tests
pnpm test:e2e:ui    # E2E with Playwright UI
```

## Deployment

| Component | Platform | Trigger |
|-----------|----------|---------|
| Frontend | Vercel | Push to main |
| Backend | Railway | Push to main |

Production requires HTTPS — the frontend on Vercel and backend on Railway both receive automatic TLS certificates.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Branch naming conventions
- Commit message format (Conventional Commits)
- Code style (ESLint + Prettier)
- Pull request process and review requirements

**Quick contribution flow:**
```bash
git checkout -b feature/your-feature-name
# Make changes
pnpm test && pnpm lint && pnpm typecheck
git commit -m "feat: your change"
git push origin feature/your-feature-name
```

## License

MIT — see [LICENSE](./LICENSE) for details.

## Author

[sachinksamad1](https://github.com/sachinksamad1)
