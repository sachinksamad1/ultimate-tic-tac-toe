import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { MatchManager } from './managers/MatchManager.js';
import { BotManager } from './managers/BotManager.js';
import { EasyBot, MediumBot, HardBot } from './bot/BotAI.js';
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
const botManager = new BotManager();

// Temporary route to create a match (for testing)
app.post('/api/matches', (req, res) => {
  const state = matchManager.createMatch();
  res.status(201).json(state);
});

app.post('/api/matches/bot', (req, res) => {
  const { difficulty } = req.body;
  const state = matchManager.createMatch();
  
  let botAI;
  if (difficulty === 'hard') {
    botAI = new HardBot(4);
  } else if (difficulty === 'medium') {
    botAI = new MediumBot();
  } else {
    botAI = new EasyBot();
  }

  // Automatically join the bot
  const assignedSymbol = matchManager.joinMatch(state.matchId, {
    id: 'bot-id',
    username: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Bot`,
    symbol: 'O' // Preferred, but MatchManager decides
  }) as PlayerSymbol;

  botManager.registerBot(state.matchId, botAI, assignedSymbol);

  res.status(201).json(state);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  registerMatchHandlers(io, socket, matchManager, botManager);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
