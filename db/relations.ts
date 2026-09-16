import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    members: r.many.member(),
    sentInvitations: r.many.invitation(),
    uploadedDocuments: r.many.documents(),
    conversations: r.many.conversations(),
  },
  session: {
    user: r.one.user({ from: r.session.userId, to: r.user.id }),
  },
  account: {
    user: r.one.user({ from: r.account.userId, to: r.user.id }),
  },

  // Organization
  organization: {
    members: r.many.member(),
    invitations: r.many.invitation(),
    documents: r.many.documents(),
    conversations: r.many.conversations(),
  },
  // Member
  member: {
    organization: r.one.organization({
      from: r.member.organizationId,
      to: r.organization.id,
    }),
    user: r.one.user({ from: r.member.userId, to: r.user.id }),
  },
  // Invitation
  invitation: {
    organization: r.one.organization({
      from: r.invitation.organizationId,
      to: r.organization.id,
    }),
    inviter: r.one.user({ from: r.invitation.inviterId, to: r.user.id }),
  },
  // Documents
  documents: {
    organization: r.one.organization({
      from: r.documents.organizationId,
      to: r.organization.id,
    }),
    uploader: r.one.user({ from: r.documents.uploadedBy, to: r.user.id }),
    chunks: r.many.chunks(),
    conversations: r.many.conversations(),
  },

  // Chunks
  chunks: {
    document: r.one.documents({
      from: r.chunks.documentId,
      to: r.documents.id,
    }),
    organization: r.one.organization({
      from: r.chunks.organizationId,
      to: r.organization.id,
    }),
  },
  // Conversations
  conversations: {
    organization: r.one.organization({
      from: r.conversations.organizationId,
      to: r.organization.id,
    }),
    user: r.one.user({ from: r.conversations.userId, to: r.user.id }),
    document: r.one.documents({
      from: r.conversations.documentId,
      to: r.documents.id,
    }),
    messages: r.many.messages(),
  },
  // Messages
  messages: {
    conversation: r.one.conversations({
      from: r.messages.conversationId,
      to: r.conversations.id,
    }),
    citations: r.many.messageCitations(),
  },
  // Message Citations
  messageCitations: {
    message: r.one.messages({
      from: r.messageCitations.messageId,
      to: r.messages.id,
    }),
    document: r.one.documents({
      from: r.messageCitations.documentId,
      to: r.documents.id,
    }),
    chunk: r.one.chunks({
      from: r.messageCitations.chunkId,
      to: r.chunks.id,
    }),
  },
}));
