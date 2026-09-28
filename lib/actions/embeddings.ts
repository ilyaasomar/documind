import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

const embeddingModel = openai.embedding("text-embedding-3-small");

// many chunks → for uploads
export async function generateEmbeddings(
  chunks: string[],
): Promise<Array<{ content: string; embedding: number[] }>> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return chunks.map((chunk, index) => ({
    content: chunk,
    embedding: embeddings[index],
  }));
}

// one text → for search queries later
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });

  return embedding;
}
