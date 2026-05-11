# 03 - Frontend Architecture: SvelteKit & Vercel

## Overview

The frontend is built with **SvelteKit**, providing a fast, reactive UI with excellent developer experience. It is optimized for server-side rendering (SSR) of the initial page load and seamless client-side transitions.

## Tech Stack (Frontend)

- **Framework**: SvelteKit (Svelte 5 preferred).
- **State Management**: Svelte Stores for global game state and real-time updates.
- **Styling**: Vanilla CSS or Tailwind CSS for a responsive, modern look.
- **Communication**: Socket.io-client for real-time interaction with the Railway-hosted backend.
- **Hosting**: Vercel (Best-in-class for SvelteKit).

## Component Architecture

### Component Hierarchy

- `App.svelte` (Root Layout)
  - `GameContainer.svelte` (Handles socket connections and match logic)
    - `GlobalBoard.svelte` (3x3 grid of local boards)
      - `LocalBoard.svelte` (3x3 grid of cells)
        - `Cell.svelte` (Individual clickable units)
  - `UIOverlay.svelte` (Game status, winner announcements, chat)

### Reactive State Flow

1.  **Socket Store**: A custom Svelte store that wraps the Socket.io connection.
2.  **Game Store**: Subscribes to the Socket Store. When the backend emits a `game_update`, the Game Store updates its state, triggering a re-render across all UI components.
3.  **Local Actions**: When a user clicks a `Cell`, it triggers a function that validates the move against the _current local state_ and emits a `make_move` event to the backend.

## Performance & UX

- **Client-Side Prediction**: The UI updates immediately when a player moves, providing a zero-latency feel. If the server rejects the move, the state is rolled back.
- **Responsive Design**: The 9x9 grid is complex; the UI uses CSS Grid and Flexbox to ensure it remains playable on mobile devices.
- **Animations**: Svelte transitions are used to highlight the `nextTargetBoard` and celebrate wins on local/global boards.

## Vercel Deployment

- **Auto Deploys**: Integrated with GitHub for seamless deployments on every push.
- **Serverless Functions**: Used for non-gameplay logic like fetching user stats or high scores from a database.

## Assets & Resources

### Sound Effects

- Move placement: short click/tap sound
- Board win: celebratory chime
- Global win: extended victory sound
- Error/invalid move: subtle buzz
- All sounds optional, mute toggle in UI

### Typography

- Primary font: System font stack for performance
- Fallback: Inter or system sans-serif
- Monospace for game status text

### Icons

- X and O marks: SVG inline (scalable, themeable)
- Board status icons: SVG for win/draw/active states
- UI icons: Heroicons or inline SVGs

### Animation Budget

- Move placement: 150ms ease-out transform
- Board win overlay: 300ms scale + opacity
- Global win celebration: 500ms staggered animation
- Respects `prefers-reduced-motion` media query
