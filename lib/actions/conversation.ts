import { db } from "@/db";

import { chunks, conversations, messageCitations, messages } from "@/db/schema";
import { generateEmbedding } from "./embeddings";
import { and, cosineDistance, desc, eq, sql } from "drizzle-orm";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function processConversation(
  prompt: string,
  selectedDocumentId: string,
  userId: string,
  organizationId: string,
  document_name: string,
) {
  //   check if conversation already exist for this document and this user
  const existingConversation = await db.query.conversations.findFirst({
    where: {
      documentId: selectedDocumentId,
      userId: userId,
      organizationId: organizationId,
    },
  });

  let conversationId: string = "";

  if (existingConversation) {
    conversationId = existingConversation.id;
  } else {
    // create a new conversation and assign the question as title
    const [created] = await db
      .insert(conversations)
      .values({
        documentId: selectedDocumentId,
        userId,
        organizationId,
        title: document_name, // instead of storing first question store the book name as title
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create a new conversation.");
    }

    conversationId = created.id;
  }

  // create the message for the conversation only saves the question
  const [savedQuestion] = await db
    .insert(messages)
    .values({
      conversationId,
      role: "user",
      content: prompt,
    })
    .returning();

  const queryEmbedding = await generateEmbedding(prompt);
  const similarity = sql<number>`1 - (${cosineDistance(chunks.embedding, queryEmbedding)})`;

  console.log("similarity in processConversation", similarity);

  const matches = await db
    .select({
      id: chunks.id,
      content: chunks.content,
      pageNumber: chunks.pageNumber,
      chunkIndex: chunks.chunkIndex,
      similarity,
    })
    .from(chunks)
    .where(
      and(
        eq(chunks.documentId, selectedDocumentId),
        eq(chunks.organizationId, organizationId),
      ),
    )
    .orderBy(desc(similarity))
    .limit(5);

  console.log("matches in processConversation", matches);

  console.log(
    "matches in processConversation",
    matches.map((match) => ({
      pageNumber: match.pageNumber,
      score: match.similarity.toFixed(3),
    })),
  );

  const context = matches
    .map(
      (match, i) => `[${i + 1}] (page ${match.pageNumber})\n${match.content}`,
    )
    .join("\n\n");

  console.log("context in processConversation", context);

  // check wether the match matches or not
  if (matches.length === 0 || matches[0].similarity < 0.15) {
    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: "No matching passages found. Try again.",
      notFound: true,
    });
    throw new Error("No matching passages found. Try again.");
  } else {
    console.log("matches in processConversation", matches);
    // stream the answer instead of waiting for the full text
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: [
        "You answer questions about one document.",
        "Use only the passages provided. Never use outside knowledge.",
        "If the passages do not contain the answer, reply exactly: I could not find this in this document.",
        "Never guess. Never use what you know about the world.",
        "Start with a one-sentence answer, then details if needed.",
      ].join(" "),
      prompt: `Passage:\n\n${context}\n\nQuestion: ${prompt}`,

      // runs on the server when the answer is complete
      onFinish: async ({ text }) => {
        const [assistantMessage] = await db
          .insert(messages)
          .values({
            conversationId,
            role: "assistant",
            content: text,
            model: "gpt-4o-mini",
          })
          .returning();

        await db.insert(messageCitations).values(
          matches.map((match, i) => ({
            messageId: assistantMessage.id,
            number: i + 1,
            chunkId: match.id,
            documentId: selectedDocumentId,
            documentName: document_name,
            quote: match.content.slice(0, 500),
            pageNumber: match.pageNumber,
            score: match.similarity,
          })),
        );
      },
    });

    return { conversationId, result };
  }
}
