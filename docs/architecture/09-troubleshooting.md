# 09 - Troubleshooting & FAQ

## Quick Diagnostics

Run this checklist when encountering issues:

1. Are both servers running? (`pnpm dev`)
2. Are environment variables set correctly?
3. Is the frontend connecting to the correct backend URL?
4. Are there CORS errors in the browser console?
5. Is the WebSocket connection established? (check Network tab for `websocket` type)

---

## Common Errors

### Connection Issues

#### "Connection refused" when loading the game

**Cause**: Backend server is not running or URL is incorrect.

**Fix**:

1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `PUBLIC_BACKEND_URL` in `apps/web/.env` matches the backend address
3. If deployed, verify Railway service is healthy in the dashboard

#### "CORS error" in browser console

**Cause**: Frontend origin not whitelisted in backend CORS config.

**Fix**:

1. Check `FRONTEND_URL` in `apps/server/.env`
2. For local dev, ensure it includes `http://localhost:5173`
3. For production, ensure it matches the exact Vercel deployment URL

#### WebSocket connects but no game events received

**Cause**: Socket.io namespace mismatch or room not joined.

**Fix**:

1. Verify frontend emits `join_match` before attempting moves
2. Check backend logs for room creation confirmation
3. Verify both players are in the same `matchId` room

---

### Gameplay Issues

#### "Move rejected: NOT_YOUR_TURN"

**Cause**: Client sent a move when it was not the player's turn.

**Fix**:

- This is expected behavior when clicking during opponent's turn
- UI should disable cell clicks when `isMyTurn` is false
- If happening incorrectly, check `activePlayer` in game state

#### "Move rejected: WRONG_BOARD"

**Cause**: Player clicked in a board other than the required target board.

**Fix**:

- Highlight the active board visually (already in UI spec)
- Disable clicks on inactive boards
- Check `nextTargetBoard` in game state matches the board clicked

#### "Move rejected: CELL_OCCUPIED"

**Cause**: Player clicked a cell that already has a mark.

**Fix**:

- UI should not render clickable cells as interactive when occupied
- Check cell value before attempting move (client-side validation)

#### Game state desyncs between players

**Cause**: Race condition or missed WebSocket message.

**Fix**:

1. Both clients should request full state refresh on reconnect
2. Server broadcasts full `GameState` on every move (not diffs)
3. Check for network instability or WebSocket drops
4. If persistent, check server logs for duplicate move processing

---

### Deployment Issues

#### Vercel build fails

**Common causes**:

- Missing `PUBLIC_BACKEND_URL` in Vercel environment variables
- SvelteKit adapter not configured for Vercel (`@sveltejs/adapter-vercel`)
- Node version mismatch in build settings

**Fix**:

1. Verify environment variables in Vercel project settings
2. Check `svelte.config.js` uses the Vercel adapter
3. Set Node.js version to 20 in Vercel project settings

#### Railway deployment crashes on startup

**Common causes**:

- Missing `PORT` or `FRONTEND_URL` environment variables
- Build output directory incorrect
- TypeScript compilation errors in production build

**Fix**:

1. Check Railway logs for the specific error message
2. Verify all required env vars are set in Railway dashboard
3. Ensure `pnpm build` succeeds locally before deploying
4. Check `start` script in `package.json` points to compiled output

#### WebSocket fails in production (HTTPS site)

**Cause**: Mixed content — HTTPS frontend trying to connect to WS (non-secure) backend.

**Fix**:

1. Ensure `PUBLIC_BACKEND_URL` uses `https://` (or `wss://`)
2. Railway provides HTTPS automatically for custom domains
3. Socket.io client handles protocol upgrade automatically when URL is correct

---

## FAQ

### Q: How do I reconnect to a game after a disconnect?

**A**: The session ID is stored in `localStorage`. On reconnect, the client automatically attempts to rejoin the active match. The server retains game state for disconnected players for up to 5 minutes. If both players disconnect, the match is cleaned up after 5 minutes of inactivity.

### Q: Can I play against myself for testing?

**A**: Yes. Open the game URL in two browser tabs (or one tab and one incognito window). Create a match in one tab and join it in the other. Both tabs will have independent WebSocket connections.

### Q: How do I reset my session?

**A**: Clear `localStorage` in your browser DevTools (Application → Local Storage → Clear All) or run `localStorage.clear()` in the console. Refresh the page to generate a new session.

### Q: Why is the game laggy on mobile?

**A**: The 9x9 grid has 81 interactive elements. On lower-end devices, consider:

- Using the `prefers-reduced-motion` media query to disable animations
- Reducing CSS complexity for mobile breakpoints
- Checking for excessive re-renders in Svelte DevTools

### Q: What happens if a player closes their browser mid-game?

**A**: The server detects the disconnection via WebSocket close event and notifies the opponent. The game state is preserved for 5 minutes. If the player reconnects within that window, the game resumes. If not, the opponent wins by forfeit.

### Q: How do I test rate limiting locally?

**A**: Set `LOG_LEVEL=debug` in the backend `.env` to see rate limit events. You can trigger rate limits by sending rapid WebSocket messages. The default is 30 messages per 10 seconds.

### Q: Can I spectate a game?

**A**: Not currently. The room system only supports 2 players. Spectator mode is a potential future enhancement.

---

## Getting Help

If the above doesn't resolve your issue:

1. Check the browser console for error messages
2. Check the backend server logs
3. Enable debug logging: `LOG_LEVEL=debug` on server, `debug.enable('socket.io-client:*')` on client
4. Review the [architecture docs](../README.md) for expected behavior
5. Open a GitHub issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS info
   - Relevant console/server logs
