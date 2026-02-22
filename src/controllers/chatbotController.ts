import { Request, Response } from "express";
import { IChatbotService } from "../interfaces/chatbot/IChatbotService";


export class ChatController {
  constructor(private chatbotService: IChatbotService) {}

  async chat(req: Request, res: Response) {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await this.chatbotService.generateAnswer(message);

    res.json({ reply });
  }
}
