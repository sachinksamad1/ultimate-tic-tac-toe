# 04 - Backend Architecture: Node.js & Railway

## Overview
The backend is a stateful Node.js application responsible for multiplayer matchmaking, real-time communication, and authoritative game logic enforcement.

## Tech Stack (Backend)
-   **Environment**: Node.js (v20+).
-   **Server Framework**: Express.js.
-   **Real-time Communication**: Socket.io.
-   **Language**: TypeScript for type safety and shared interfaces with the frontend.
-   **Hosting**: **Railway** (Excellent for persistent WebSockets and stateful backends).

## Multiplayer Engine

### Room Management
-   The backend uses `Rooms` to isolate different matches.
-   When a player joins, they are placed in a lobby or assigned to a specific room ID.
-   The server maintains an in-memory map of `Match` objects, keyed by room ID.

### WebSocket Events
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_match` | Client -> Server | `{ matchId: string }` | Player requests to join a specific match. |
| `make_move` | Client -> Server | `{ x: number, y: number }` | Player attempts to place a mark. |
| `match_ready` | Server -> Client | `{ players: Player[] }` | Notifies both clients that the match can start. |
| `game_update` | Server -> Client | `GameState` | Broadcasts the updated board and turn information. |
| `player_left` | Server -> Client | `{ playerId: string }` | Handles sudden disconnections. |

## Authoritative Logic
The server is the final arbiter of truth.
1.  **Validation**: Every `make_move` event is checked against the internal `GameState` for the room.
2.  **State Transition**: If valid, the server updates the `localBoards`, checks for a local win, updates the `globalBoard`, checks for a global win, and updates the `nextTargetBoard`.
3.  **Broadcast**: The updated state is broadcasted to all participants in the room via `io.to(roomId).emit('game_update', newState)`.

## Railway Deployment
Railway is chosen for its ability to handle long-lived TCP connections (WebSockets) which serverless platforms (like Vercel) often struggle with.
-   **Auto-Deploys**: Connected to the backend repository for CI/CD.
-   **Environment Variables**: Securely stores database credentials and API keys.
-   **Reliability**: Provides a persistent environment where the server process stays alive to manage active games.

## Extended WebSocket Events

### Additional Events
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `error` | Server -> Client | `{ code: string, message: string }` | Error response for invalid actions. See [06-security.md](./06-security.md) for error codes. |
| `reconnect` | Client -> Server | `{ sessionId: string, matchId: string }` | Player attempts to rejoin after disconnect. |
| `heartbeat` | Bidirectional | `{ timestamp: number }` | Ping-pong to detect stale connections. Sent every 30 seconds. |
| `chat_message` | Client -> Server | `{ content: string }` | Player sends a chat message to opponent. |
| `chat_message` | Server -> Client | `{ playerId: string, content: string, timestamp: Date }` | Broadcast chat message to room. |

## Reconnection Strategy

### Server-Side
- Player disconnection detected via Socket.io `disconnect` event
- Game state preserved for 5 minutes
- Opponent notified via `player_left` event
- If both players disconnect, match cleaned up after 5 minutes

### Client-Side
- Socket.io auto-reconnect enabled (3 attempts, exponential backoff)
- On reconnect, client emits `reconnect` with `sessionId` and `matchId`
- Server responds with full `GameState` to sync client
- UI state restored from received state

### Simultaneous Disconnect Handling
- If both players disconnect within the same 5-minute window, both can reconnect independently
- If timeout expires, match is marked as `FINISHED` with no winner (both forfeit)
- Match history preserved for replay analysis
