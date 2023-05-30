import { Game } from "@gathertown/gather-game-client";
import { Configuration, OpenAIApi } from "openai";

class AIManager {
  private static instance: AIManager
  private apiKey: string
  private openai: OpenAIApi
  public game!: Game

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY as string
    const configuration = new Configuration({ apiKey: this.apiKey });
    this.openai = new OpenAIApi(configuration);
  }


  public static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager()
    }

    return AIManager.instance
  }

  async getAIReply(message: string, systemMessage: string, fallbackMessage: string) {
    try {
      const res = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          { role: "user", content: message },
        ],
      });

      if (!res.data.choices[0].message) return fallbackMessage;
      return res.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return fallbackMessage;
    }
  }

}

export default AIManager