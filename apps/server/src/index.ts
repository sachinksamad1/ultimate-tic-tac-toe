import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { MatchManager } from './managers/MatchManager.js';
import { registerMatchHandlers } from './handlers/matchHandlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting for Socket.io
const socketLimiter = new RateLimiterMemory({
  points: 30, // 30 points
  duration: 10, // per 10 seconds
});

io.use(async (socket, next) => {
  try {
    await socketLimiter.consume(socket.id);
    next();
  } catch {
    next(new Error('Too many requests. Please slow down.'));
  }
});

const matchManager = new MatchManager();

// Temporary route to create a match (for testing)
app.post('/api/matches', (req, res) => {
  const state = matchManager.createMatch();
  res.status(201).json(state);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  registerMatchHandlers(io, socket, matchManager);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
