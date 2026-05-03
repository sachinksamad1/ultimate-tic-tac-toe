# Ultimate Tic-Tac-Toe Documentation

Welcome to the documentation for the Ultimate Tic-Tac-Toe project. This project is a fullstack, real-time multiplayer implementation of the complex 9x9 Tic-Tac-Toe variant.

## Architecture & Design

The documentation is split into several sections for better clarity and maintainability:

1.  **[01 - System Overview](./architecture/01-overview.md)**: High-level design, project vision, and technology stack (SvelteKit, Node.js, Vercel, Railway).
2.  **[02 - Game Logic](./architecture/02-game-logic.md)**: Detailed explanation of the Ultimate Tic-Tac-Toe rules, win conditions, and state management.
3.  **[03 - Frontend Architecture](./architecture/03-frontend.md)**: Implementation details for the SvelteKit frontend, reactive stores, and Vercel deployment.
4.  **[04 - Backend Architecture](./architecture/04-backend.md)**: Details on the Node.js/Express server, WebSocket events with Socket.io, and Railway hosting.
5.  **[05 - Data Models](./architecture/05-data-models.md)**: TypeScript interfaces and domain entities shared across the stack.
6.  **[06 - Security](./architecture/06-security.md)**: Authentication model, CORS, rate limiting, input validation, and infrastructure hardening.
7.  **[07 - Testing](./architecture/07-testing.md)**: Testing strategy, coverage targets, test frameworks, and CI integration.
8.  **[08 - Development Setup](./architecture/08-development-setup.md)**: Local development instructions, environment variables, and debugging guides.
9.  **[09 - Troubleshooting](./architecture/09-troubleshooting.md)**: Common errors, FAQ, and debugging workflows.
10. **[10 - Bot Architecture](./architecture/10-bot.md)**: Design and implementation details for the single-player AI opponent.

## Visual Diagrams

See **[Architecture Diagrams](./diagrams.md)** for Mermaid diagrams covering system architecture, WebSocket event flows, game state machine, and component hierarchy.

## Implementation Roadmap

The implementation is broken down into structured tasks to track progress:

-   **[Task 01: Infrastructure](./task/01-infrastructure.md)**
-   **[Task 02: Game Engine](./task/02-game-engine.md)**
-   **[Task 03: Multiplayer Backend](./task/03-multiplayer-backend.md)**
-   **[Task 04: Frontend & UI](./task/04-frontend-ui.md)**
-   **[Task 05: Single Player Bot](./task/05-single-player-bot.md)**
-   **[Task 06: Deployment & Launch](./task/06-launch.md)**

## Getting Started

See **[Development Setup](./architecture/08-development-setup.md)** for full local development instructions.

Quick start:
```bash
git clone <repository-url>
cd ultimate-tic-tac-toe
pnpm install
pnpm dev
```

## Deployment

-   **Frontend**: Automatically deployed to Vercel.
-   **Backend**: Automatically deployed to Railway.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for branch naming, commit conventions, and PR process.
