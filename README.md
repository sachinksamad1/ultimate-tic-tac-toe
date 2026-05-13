# 🎮 Ultimate Tic-Tac-Toe

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A fullstack, real-time multiplayer implementation of the **Ultimate Tic-Tac-Toe** variant — a strategically deep 9x9 grid game where every move dictates your opponent's next battlefield.

## 🚀 Features

- **🌐 Real-Time Multiplayer** — Play against opponents anywhere via persistent WebSocket connections.
- **🤖 Single Player Bots** — Test your skills against 3 difficulty levels: **Easy**, **Medium**, and **Hard** (Minimax).
- **🇮🇳 Multi-language Support** — Full localization for **English** and **Hindi**.
- **⚖️ Authoritative Server** — All moves validated server-side to ensure game integrity.
- **⚡ Zero Latency Feel** — Optimistic UI updates keep gameplay smooth.
- **📱 Responsive Design** — Adaptive 9x9 grid for desktop, tablet, and mobile.
- **⌨️ Accessibility** — Full keyboard navigation and ARIA support.

## 🛠️ Tech Stack

| Layer         | Technology                                                         | Rationale                                           |
| ------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| **Frontend**  | [SvelteKit](https://kit.svelte.dev/)                               | Reactive stores and excellent developer experience. |
| **Backend**   | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | Robust stateful environment for game sessions.      |
| **Real-time** | [Socket.io](https://socket.io/)                                    | Reliable bi-directional WebSocket communication.    |
| **Monorepo**  | [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/)       | Efficient build pipeline and workspace management.  |
| **Testing**   | [Vitest](https://vitest.dev/)                                      | Fast and modern unit/integration testing.           |

## 🗺️ Project Roadmap

| Phase  | Description                         | Status      |
| ------ | ----------------------------------- | ----------- |
| **01** | Infrastructure & Shared Foundations | ✅ Complete |
| **02** | Core Game Engine & Win Logic        | ✅ Complete |
| **03** | Multiplayer Backend (Socket.io)     | ✅ Complete |
| **04** | Frontend UI & Reactive Stores       | ✅ Complete |
| **05** | Single Player Bot Integration       | ✅ Complete |
| **06** | Deployment & Launch                 | ✅ Complete |

## 📖 Documentation

Detailed documentation is available in the [`/docs`](./docs) directory:

- 🏛️ **[System Overview](./docs/architecture/01-overview.md)** — Vision and architecture.
- 🧠 **[Game Logic](./docs/architecture/02-game-logic.md)** — Rules and state machine.
- 🤖 **[Bot AI](./docs/architecture/10-bot.md)** — Minimax and heuristics.
- 🧪 **[Testing Strategy](./docs/architecture/07-testing.md)** — Coverage and methodology.

## 🏁 Quick Start

### Prerequisites

- **Node.js** v24+
- **pnpm** v10+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/sachinksamad1/ultimate-tic-tac-toe.git
cd ultimate-tic-tac-toe

# Install dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3001`

## 🚀 Deployment

The project is designed to be deployed as a split architecture:

### 1. Backend (Railway)

The stateful Node.js server is best hosted on **Railway** to support persistent WebSockets.

- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm --filter server start`
- **Environment Variables**:
  - `PORT`: (Automatically set by Railway)
  - `FRONTEND_URL`: The URL of your deployed SvelteKit frontend.

### 2. Frontend (Vercel)

The SvelteKit frontend is optimized for **Vercel**.

- **Build Command**: `pnpm install && pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.svelte-kit` (or default Vercel SvelteKit detection)
- **Environment Variables**:
  - `PUBLIC_BACKEND_URL`: The URL of your deployed Railway server.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed setup instructions and our coding standards.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚖️ License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

## 👤 Author

**Sachin K Samad**

- GitHub: [@sachinksamad1](https://github.com/sachinksamad1)
- LinkedIn: [Sachin K Samad](https://www.linkedin.com/in/sachin-s-710292376/)
- Repo: [ultimate-tic-tac-toe](https://github.com/sachinksamad1/ultimate-tic-tac-toe)

---

Built with ❤️ by [Sachin K Samad](https://github.com/sachinksamad1)
