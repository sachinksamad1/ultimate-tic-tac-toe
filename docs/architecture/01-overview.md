# 01 - System Overview: Ultimate Tic-Tac-Toe

## Project Vision

Ultimate Tic-Tac-Toe is a complex, multi-layered version of the classic game that adds strategic depth and a larger scale. This project aims to provide a high-performance, real-time multiplayer experience that is easy to deploy and maintain.

## High-Level Architecture

The application follows a modern client-server architecture designed for real-time interactivity and scalability.

### Core Components

1.  **Frontend (Client)**: A SvelteKit application providing a reactive and smooth user interface. It handles game rendering, user input, and client-side move prediction.
2.  **Backend (Server)**: A Node.js/Express server that acts as the authoritative source for game state. It manages active matches, validates moves, and handles real-time communication via WebSockets.
3.  **Data Layer**: A lightweight database (e.g., PostgreSQL or MongoDB) for persisting user profiles, match history, and session data.

## Technology Stack

| Component               | Technology      | Hosting / Provider | Rationale                                                                           |
| ----------------------- | --------------- | ------------------ | ----------------------------------------------------------------------------------- |
| **Frontend**            | SvelteKit       | Vercel             | Excellent DX, reactive stores for game state, and best-in-class serverless hosting. |
| **Real-time Engine**    | Socket.io       | Railway            | Provides reliable, persistent WebSocket connections required for multiplayer.       |
| **Multiplayer API**     | Node.js/Express | Railway            | Stateful environment ideal for managing long-running game sessions.                 |
| **Deployment Pipeline** | GitHub Actions  | Vercel/Railway     | Automated CI/CD for both frontend and backend components.                           |

## Deployment Strategy

- **Vercel**: Hosts the SvelteKit frontend and static assets. Leverages serverless functions for non-real-time API calls (e.g., authentication, leaderboard lookups).
- **Railway**: Hosts the persistent Node.js backend. Unlike serverless platforms, Railway provides the stable environment needed for WebSockets and in-memory session management, ensuring a seamless multiplayer experience.
