

import { IChatbotService } from '../interfaces/chatbot/IChatbotService';
import { getQueryEmbedding } from '../utils/getQueryEmbedding';
import { IVectorSearchRepository } from '../interfaces/chatbot/IChatbotRepository';
import { openai } from '../config/openai';

export class ChatbotService implements IChatbotService {
  constructor(
     // Inject repository responsible for MongoDB vector search
       private vectorRepository: IVectorSearchRepository ,
  ) {}

//   async generateAnswer(query: string): Promise<string> {
//     const queryEmbedding = await getQueryEmbedding(query);
//     const results  = await this.vectorRepository.searchSimilarChunks(queryEmbedding)
//     if (!results.length) {
//   return "I don't have information about that in our available courses.";
// }
//      // Combine top results into context
//         // const context = results.map((r) => r.text).join("\n\n");
//           const context = results
//     .slice(0, 3)
//     .map((r) => r.text.slice(0, 1200))
//     .join("\n\n");
//     const completion = await openai.chat.completions.create({
//   model: "openai/gpt-oss-20b:free",
//   temperature: 0.2,
//   max_tokens: 150,
//     messages: [
//   {
//     role: "system",
//     content: `
// You are an LMS course advisor.
// Answer ONLY using the provided course context.
// If answer is not found, say:
// "I don't have information about that in our available courses."
// Be concise and structured.
// `,
//   },
//   {
//     role: "assistant",
//     content: `Course Context:\n${context}`,
//   },
//   {
//     role: "user",
//     content: query,
//   },
// ]
//     });

//     return completion.choices[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a response.";
//   }
async generateAnswer(query: string): Promise<string> {
    const normalized = query.trim().toLowerCase();

  // -----------------------
  // 1️ SMALL TALK HANDLING
  // -----------------------
  const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
  const thanks = ["thanks", "thank you", "thx"];

  if (greetings.includes(normalized)) {
    return `Hello 👋  
I'm your SkillSeed Assistant.

You can ask me about:
• Available courses  
• Course prices  
• Instructors  
• Categories`;
  }

  if (thanks.includes(normalized)) {
    return `You're welcome 😊  
Let me know if you'd like help finding a course.`;
  }

  if (normalized === "help") {
    return `Here’s what I can help you with:

• Find courses  
• Check pricing  
• Know instructors  
• Understand course content`;
  }
   
    //  Convert Query → Embedding
    // Embedding converts text into vector numbers
    // This allows semantic similarity search
  const queryEmbedding = await getQueryEmbedding(query);
  //Perform Vector Search in MongoDB
  const results = await this.vectorRepository.searchSimilarChunks(queryEmbedding);
if (results.length === 0 || results[0].score < 0.75) {
    return "I don't have information about that in our available courses.";
  }
 
    // Build Context for LLM
    // Take top 3 most relevant results
    // Limit text length to avoid token explosion
  const context = results
    .slice(0, 3)
    .map((r) => r.text.slice(0, 1200))
    .join("\n\n");

  try {
     //Send Context + Query to LLM
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0.2,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `
You are an LMS course advisor.
STRICT RULES:
- DO NOT use tables.
- DO NOT use markdown tables.
- Respond in simple bullet points.
- Keep response short and clean.
- Use plain text formatting only
Use ONLY the provided course context.
If the answer is not in context, say:
"I don't have information about that in our available courses."

Be concise and structured.
`,
        },
       {
    role: "assistant",
    content: context
  },

  {
    role: "user",
    content: query
  }
      ],
    });
 // Return AI response safely
    return (
      completion.choices[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response."
    );
  } catch (error: any) {
      // Handle rate limit
    if (error.status === 429) {
      return "AI service is busy. Please try again in a few seconds.";
    }
    console.error(error);
    return "Something went wrong while generating response.";
  }
}
}