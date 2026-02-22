import OpenAI from "openai";
import { openai } from "../config/openai";




export const  getQueryEmbedding= async(text: string): Promise<number[]>=> {
    if (!text.trim()) throw new Error('Empty query');

    const response = await openai.embeddings.create({
      model: "BAAI/bge-m3",
      input: text.trim(),
    });

    return response.data[0].embedding;
  }