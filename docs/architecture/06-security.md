# 06 - Security & Authentication

## Overview

This document outlines the security model for Ultimate Tic-Tac-Toe, covering authentication, authorization, data validation, and infrastructure hardening.

## Authentication Model

### Anonymous Play with Optional Accounts

The primary gameplay flow requires no account creation. Players are assigned a unique session identifier upon connecting, enabling instant matchmaking.

```
Player connects → Server assigns session ID
Session ID stored in browser localStorage
Session used for matchmaking and game state
Player may optionally link account later
```

### Session Management

- **Session ID Generation**: UUID v4, generated server-side on first connection
- **Session Storage**: `localStorage` on client, in-memory map on server (backed by DB for persistence)
- **Session Lifetime**: 7 days of inactivity before expiration
- **Session Reuse**: Returning players with existing session IDs retain their identity and stats

### Optional Account System (Future)

- **Registration**: Email/password or OAuth (Google, GitHub)
- **Token-based Auth**: JWT access tokens (15 min expiry) + refresh tokens (7 day expiry)
- **Account Linking**: Players can link their anonymous session to an account to preserve stats
- **Protected Routes**: Only authenticated users can access profile edits, match history export, and leaderboard submissions

## Authorization

### Access Control Matrix

| Resource            | Anonymous       | Account Holder  | Opponent                |
| ------------------- | --------------- | --------------- | ----------------------- |
| Join match          | Yes             | Yes             | Yes                     |
| View own games      | Session only    | All history     | No                      |
| View opponent games | No              | No              | Only active shared game |
| Edit profile        | No              | Yes             | No                      |
| View leaderboard    | Yes (read-only) | Yes (read-only) | Yes (read-only)         |

### Room Isolation

- Players are isolated to their `matchId` room via Socket.io
- Server validates `playerId` matches an active participant before processing moves
- Cross-room data leakage is prevented by scoping all emits to `io.to(roomId)`

## CORS Configuration

### Allowed Origins

```typescript
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
};
```

### Rules

- Production: strictly whitelist the Vercel frontend URL
- Development: allow localhost on standard dev ports
- No wildcard (`*`) origins in any environment

## Rate Limiting

### Socket.io Middleware

- **Connection Rate**: Max 10 new connections per IP per minute
- **Message Rate**: Max 30 messages per player per 10 seconds (covers move spam)
- **Room Creation**: Max 5 rooms per IP per minute

### Implementation

```typescript
import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const socketLimiter = new RateLimiterMemory({
  points: 30,
  duration: 10,
});

io.use(async (socket, next) => {
  try {
    await socketLimiter.consume(socket.id);
    next();
  } catch {
    next(new Error('Too many requests. Please slow down.'));
  }
});
```

### Penalties

- Rate limit exceeded → `error` event with code `RATE_LIMITED`
- Repeated violations → temporary IP ban (5 minutes)
- Permanent bans handled manually via admin interface

## Input Validation & Sanitization

### Server-Side Validation (Authoritative)

Every `make_move` event is validated regardless of client-side checks:

| Check         | Validation                                                   | Error Code        |
| ------------- | ------------------------------------------------------------ | ----------------- |
| Player turn   | `move.playerId === state.activePlayer`                       | `NOT_YOUR_TURN`   |
| Target board  | `move.boardIndex === state.nextTargetBoard` or free move     | `WRONG_BOARD`     |
| Cell empty    | `state.localBoards[boardIndex].cells[cellY][cellX] === null` | `CELL_OCCUPIED`   |
| Board bounds  | `0 <= x <= 2` and `0 <= y <= 2`                              | `OUT_OF_BOUNDS`   |
| Game active   | `state.status === 'PLAYING'`                                 | `GAME_NOT_ACTIVE` |
| Payload types | `typeof x === 'number'`, etc.                                | `INVALID_PAYLOAD` |

### Payload Sanitization

- All incoming WebSocket payloads are validated with Zod or io-ts schemas
- Numeric inputs are bounded and type-checked
- String inputs (usernames) are trimmed and length-limited (max 30 chars)
- HTML/script injection is prevented by treating all strings as plain text

### Username Policy

- Min 3 chars, max 30 chars
- Allowed: alphanumeric, underscores, hyphens
- Blocked: special characters, SQL injection patterns, reserved words

## Data Protection

### Secrets Management

- All secrets stored as Railway environment variables
- No `.env` files committed to git (enforced via `.gitignore`)
- Database credentials rotated on deployment
- JWT signing keys stored as encrypted Railway secrets

### Data in Transit

- All WebSocket connections use WSS (TLS) in production
- Railway provides automatic TLS termination
- No sensitive data (passwords, tokens) transmitted over sockets

### Data at Rest

- Password hashes use bcrypt (cost factor 12)
- Match history is anonymized after 90 days
- User data export available upon request (GDPR compliance)

## Infrastructure Hardening

### Express Security Headers

```typescript
import helmet from 'helmet';
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", process.env.BACKEND_URL],
      },
    },
  }),
);
```

### Additional Measures

- **HSTS**: Enforce HTTPS for all frontend traffic
- **X-Frame-Options**: Prevent clickjacking via `DENY`
- **Rate-limited health endpoint**: `/health` for Railway monitoring only
- **Dependency auditing**: `npm audit` run in CI pipeline

## Error Handling

### Error Response Format

```typescript
interface SocketError {
  code: string; // Machine-readable code
  message: string; // Human-readable message
  details?: unknown; // Optional debug info (dev only)
  timestamp: Date;
}
```

### Error Codes

| Code              | Severity | Client Action                   |
| ----------------- | -------- | ------------------------------- |
| `NOT_YOUR_TURN`   | Info     | Wait for opponent               |
| `WRONG_BOARD`     | Info     | Highlight correct board         |
| `CELL_OCCUPIED`   | Info     | Click another cell              |
| `OUT_OF_BOUNDS`   | Warning  | Should not happen with UI       |
| `GAME_NOT_ACTIVE` | Warning  | Refresh match state             |
| `INVALID_PAYLOAD` | Error    | Disconnect likely needed        |
| `RATE_LIMITED`    | Warning  | Wait before retrying            |
| `INTERNAL_ERROR`  | Critical | Reconnect, report if persistent |

## Monitoring & Incident Response

### Logging

- All connection events logged (connect, disconnect, join, leave)
- All move validation failures logged with player ID and error code
- No sensitive data (passwords, tokens) in logs
- Structured JSON logs for aggregation

### Alerting Thresholds

- Error rate > 5% of requests in 5-minute window → alert
- Concurrent connections > expected max → alert
- Response latency p99 > 500ms → alert
