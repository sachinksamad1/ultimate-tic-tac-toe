# 10 - Single Player Bot Architecture

## Overview

The Single Player mode allows users to play against an AI opponent. The AI logic resides on the server to maintain consistency with the multiplayer architecture and to allow for potentially computationally expensive algorithms (like Minimax) without impacting client-side performance.

## Architecture

The bot system is integrated into the existing WebSocket-based match flow. When a bot match is created, the server provisions a standard match and "joins" a bot instance to it.

### Components

#### 1. Bot Engine (`apps/server/src/bot/BotAI.ts`)

Defines the `BotAI` interface and specific implementations:

- **EasyBot**: Selects a valid move at random.
- **MediumBot**: Uses Minimax with a shallow depth (2) to provide a tactical challenge without long-term strategy.
- **HardBot**: Uses a Minimax algorithm with Alpha-Beta pruning.
  - **Depth**: Limited to 4-6 levels to ensure fast response times.
  - **Heuristic**: Evaluates board state based on local board control, central position advantage, and potential winning lines.

#### 2. Bot Manager (`apps/server/src/managers/BotManager.ts`)

- Responsible for managing the lifecycle of bot participants in matches.
- Listens for game state updates and triggers the corresponding bot move if it is the bot's turn.
- Introduces a synthetic delay (500ms - 1500ms) to make the bot feel more natural to play against.

## Interaction Flow

1. **Match Creation**: Client sends `POST /api/matches/bot` with a `difficulty`.
2. **Server Setup**:
   - Creates a new `GameState`.
   - Registers a bot instance in `BotManager`.
   - Returns the `matchId` to the client.
3. **Gameplay**:
   - Human player makes a move via `make_move` socket event.
   - Server validates and applies the move, then broadcasts `game_update`.
   - `BotManager` intercepts the update, sees it's the bot's turn.
   - After a short delay, the bot calculates its move and "emits" it back through the standard `make_move` logic.
   - Server applies the bot move and broadcasts the update.

## Scalability & Performance

- Bot calculations are asynchronous to avoid blocking the event loop.
- Difficulty levels allow for balancing server CPU usage vs. player challenge.
