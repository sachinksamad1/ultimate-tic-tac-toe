# Architecture Diagrams

## System Architecture

```mermaid
graph TB
    subgraph Client[Vercel - Frontend]
        A[SvelteKit App]
        B[Svelte Stores]
        C[Socket.io Client]
    end

    subgraph Server[Railway - Backend]
        D[Express Server]
        E[Socket.io Server]
        F[Match Manager]
        G[Game Engine]
    end

    subgraph Data[(Data Layer)]
        H[(PostgreSQL)]
    end

    A --> B
    B --> C
    C <-->|WebSocket| E
    E --> D
    D --> F
    F --> G
    D --> H
```

## WebSocket Event Sequence

```mermaid
sequenceDiagram
    participant P1 as Player 1
    participant FE as Frontend
    participant BE as Backend
    participant P2 as Player 2

    P1->>FE: Click "Create Match"
    FE->>BE: emit("join_match", {matchId})
    BE->>BE: Create room, assign session
    BE-->>FE: emit("match_ready")
    FE-->>P1: Show "Waiting for opponent"

    P2->>FE: Enter match ID
    FE->>BE: emit("join_match", {matchId})
    BE->>BE: Add player 2 to room
    BE-->>FE: emit("match_ready")
    FE-->>P2: Show "Game Starting"
    BE-->>FE: emit("game_update", state)

    P1->>FE: Click cell
    FE->>FE: Optimistic UI update
    FE->>BE: emit("make_move", {x, y})
    BE->>BE: Validate move
    alt Valid
        BE->>BE: Update state
        BE-->>FE: emit("game_update", newState)
        BE-->>FE: emit("game_update", newState)
    else Invalid
        BE-->>FE: emit("error", {code, message})
        FE->>FE: Rollback UI
    end
```

## Game State Machine

```mermaid
stateDiagram-v2
    [*] --> WAITING: Match created
    WAITING --> PLAYING: Second player joins
    PLAYING --> PLAYING: Valid move made
    PLAYING --> FINISHED: Global win or draw
    PLAYING --> PAUSED: Player disconnects
    PAUSED --> PLAYING: Player reconnects (< 5 min)
    PAUSED --> FINISHED: Timeout (5 min)
    FINISHED --> [*]: Match archived
```

## Frontend Component Tree

```mermaid
graph TD
    A[App.svelte] --> B[GameContainer.svelte]
    B --> C[GlobalBoard.svelte]
    B --> D[UIOverlay.svelte]
    C --> E[LocalBoard.svelte x9]
    E --> F[Cell.svelte x9]
    D --> G[StatusDisplay]
    D --> H[WinnerAnnouncement]
    D --> I[ChatPanel]
```

## Reconnection Flow

```mermaid
sequenceDiagram
    participant P as Player
    participant FE as Frontend
    participant BE as Backend

    P->>FE: Network drops
    FE->>BE: WebSocket disconnect detected
    BE->>BE: Mark player as disconnected
    BE-->>FE: emit("player_left") to opponent

    Note over P,BE: 0-5 min window

    P->>FE: Network restored
    FE->>BE: emit("reconnect", {sessionId, matchId})
    BE->>BE: Validate session and match state
    alt Match still active
        BE-->>FE: emit("game_update", currentState)
        FE->>FE: Restore UI state
    else Match expired
        BE-->>FE: emit("error", {code: "MATCH_EXPIRED"})
        FE->>FE: Show "Match expired" screen
    end
```
