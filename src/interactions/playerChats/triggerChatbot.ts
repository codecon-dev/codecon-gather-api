
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/GameEventContexts";
import { PlayerChatsEventData } from "../../types";
import { Game } from "@gathertown/gather-game-client";
import AIManager from "../../services/ai";
import ChatBotSystem from "../../systems/chatbot";

export async function triggerChatbot(data: PlayerChatsEventData, context: ServerClientEventContext, game: Game) {
  try {
    // Ignore DMs
    const messageType = data.playerChats.messageType
    if (messageType === 'DM') return

    // Ignore messages that are not commands
    const message = data.playerChats.contents
    if (message.charAt(0) !== "!") return

    // Ignore messages while the bot is replying
    const chatBot = ChatBotSystem.getInstance()
    if (chatBot.isReplying) return

    // Ignore messages from the bot
    const senderName = data.playerChats.senderName
    if (senderName === chatBot.name) return

    const command = message.substring(1)
    const mapId = context?.player?.map || 'unknown'
    const chatRecipient = data.playerChats.recipient;

    chatBot.toggleReplying(game)
    const aiManager = AIManager.getInstance();
    const reply = await aiManager.getAIReply(command, chatBot.systemMessage, chatBot.fallbackMessage);
    chatBot.replyMessage(chatRecipient, reply, game, mapId)
    chatBot.toggleReplying(game)

  } catch (error) {
    console.log(error)
  }
}