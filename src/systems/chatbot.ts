import { Game } from "@gathertown/gather-game-client";

class ChatBotSystem {
  private static instance: ChatBotSystem;
  public isReplying: boolean = false;
  public name: string = "CodeconGPT";

  constructor() {
  }

  public toggleReplying(game: Game) {
    if (!this.isReplying) {
      game.move(4, false); // Start dancing
    }

    if (this.isReplying) {
      game.move(3, true); // Stop dancing
    }

    this.isReplying = !this.isReplying;
  }

  public static getInstance(): ChatBotSystem {
    if (!ChatBotSystem.instance) {
      ChatBotSystem.instance = new ChatBotSystem()
    }

    return ChatBotSystem.instance
  }

  getBotCoordinate(game: Game) {
    const bot = Object.values(game.players).find((player) => player.name === this.name);
    if (!bot) return null
    return { x: bot.x, y: bot.y };
  };

  getNearbyPlayersIds(game: Game) {
    const botCoordinate = this.getBotCoordinate(game);
    const nearbyPlayers = game.filterPlayersInSpace((player) => {
      return (
        botCoordinate!.x - 3 <= player.x! &&
        player.x! <= botCoordinate!.x + 3 &&
        botCoordinate!.y - 4 <= player.y! &&
        player.y! <= botCoordinate!.y + 2
      );
    });

    const playerIdArray = Object.entries(game.players)
      .filter(([key, value]) =>
        nearbyPlayers.some((nearbyPlayer) => JSON.stringify(nearbyPlayer) === JSON.stringify(value))
      )
      .map(([key]) => key);
    return playerIdArray;
  };

  replyMessage(recipient: string, message: string, game: Game, mapId: string) {
    try {
      const nearby = this.getNearbyPlayersIds(game);
      game.chat(recipient, nearby, mapId, { contents: message });
    } catch (err) {
      console.error((err as any).message);
    }
  };
}

export default ChatBotSystem