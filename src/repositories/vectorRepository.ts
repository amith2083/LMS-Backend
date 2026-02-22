import { Collection, MongoClient, ObjectId } from "mongodb";
import { IVectorSearchRepository } from "../interfaces/chatbot/IChatbotRepository";

interface VectorSearchResult {
  _id: ObjectId;
  text: string;
  score: number;
  metadata?: any;
}
export class VectorSearchRepository implements IVectorSearchRepository {
  private chunksCollection: Collection;

  constructor(client: MongoClient) {
    // Connect to "course_chunks" collection inside "lms" database
    this.chunksCollection = client.db("lms").collection("course_chunks");
  }

  async searchSimilarChunks(
    queryEmbedding: number[],
    limit = 5,
    minScore = 0.72,
  ): Promise<VectorSearchResult[]> {
    //MongoDB Atlas Vector Search Pipeline
    const pipeline = [
      //  Vector Search Stage
      {
        $vectorSearch: {
          index: "vector_index_lms", // Name of vector index
          path: "embedding", // Field storing embedding
          queryVector: queryEmbedding,
          numCandidates: Math.max(50, limit * 4),
          limit,
        },
      },
      //  Project fields we need
      {
        $project: {
          text: 1,
          score: { $meta: "vectorSearchScore" },
          metadata: 1,
        },
      },
      // Filter low similarity results
      {
        $match: { score: { $gte: minScore } },
      },
    ];
    // Execute aggregation pipeline
    return this.chunksCollection
      .aggregate<VectorSearchResult>(pipeline)
      .toArray();
  }
}
