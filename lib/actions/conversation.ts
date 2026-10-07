import { db } from "@/db";

import { chunks, conversations, messageCitations, messages } from "@/db/schema";
import { generateEmbedding } from "./embeddings";
import { and, cosineDistance, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function processConversation(
  prompt: string,
  selectedDocumentId: string,
  userId: string,
  organizationId: string,
  document_name: string,
) {
  console.log("data in processConversation", {
    prompt,
    selectedDocumentId,
    userId,
    organizationId,
  });

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
        title: prompt.slice(0, 60),
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create a new conversation.");
    }

    conversationId = created.id;
  }

  // create the message for the conversation
  await db.insert(messages).values({
    conversationId,
    role: "user",
    content: prompt,
  });

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
  if (matches.length === 0 || matches[0].similarity < 0.3) {
    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: "No matching passages found. Try again.",
      notFound: true,
    });
    return NextResponse.json(
      { message: "No matching passages found." },
      { status: 404 },
    );
  } else {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: [
        "You answer questions about one document.",
        "Use only the passages provided. Never use outside knowledge.",
        "If the passages do not contain the answer, say so plainly.",
        "Start with a one-sentence answer, then details if needed.",
        "Reference passages as [1], [2] where they support a statement.",
      ].join(" "),
      prompt: `Passage:\n\n${context}\n\nQuestion: ${prompt}`,
    });

    const [assistantMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        role: "assistant",
        content: text,
        model: "gpt-4o-mini",
      })
      .returning();

    const savedCitations = await db
      .insert(messageCitations)
      .values(
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
      )
      .returning();
    return {
      conversationId,
      answer: text,
      citation: savedCitations.map((c) => ({
        number: c.number,
        documentName: c.documentName,
        pageNumber: c.pageNumber,
        quote: c.quote,
      })),
    };
  }
}

// export async function generateText(){
//   const
// }
