import {
  GameState,
  Move,
  PlayerSymbol,
  IBotStrategy,
  EasyBotStrategy,
  MediumBotStrategy,
  HardBotStrategy,
} from 'shared';

export interface BotAI {
  calculateMove(state: GameState, botSymbol: PlayerSymbol): Promise<Move>;
}

export class BotAIWrapper implements BotAI {
  constructor(private strategy: IBotStrategy) {}

  async calculateMove(state: GameState, botSymbol: PlayerSymbol): Promise<Move> {
    const moveData = await this.strategy.calculateMove(state, botSymbol);
    return {
      ...moveData,
      playerId: 'bot',
      timestamp: new Date(),
    };
  }
}

export class EasyBot extends BotAIWrapper {
  constructor() {
    super(new EasyBotStrategy());
  }
}

export class MediumBot extends BotAIWrapper {
  constructor() {
    super(new MediumBotStrategy());
  }
}

export class HardBot extends BotAIWrapper {
  constructor(maxDepth: number = 4) {
    super(new HardBotStrategy(maxDepth));
  }
}
