export interface IVectorSearchRepository {
  searchSimilarChunks(
    queryEmbedding: number[],
    limit?: number,
    minScore?: number
  ): Promise<Array<{ text: string; score: number; metadata?: any }>>;
}