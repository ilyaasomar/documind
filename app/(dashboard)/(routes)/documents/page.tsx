import { db } from "@/db";
import ShowDocumentData from "./_components/show-data";
import { documents, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getMembership } from "@/lib/actions/get-membership";
import { NextResponse } from "next/server";
export interface DocumentInterface {
  id: string;
  organizationId: string;
  name: string;
  fileType: "pdf" | "docx" | "xlsx" | "txt";
  sizeBytes: number;
  status: "uploading" | "processing" | "ready" | "failed";
  uploadedBy: string | null;
  uploaded_by_name: string;
  createdAt: string;
}
const Documents = async () => {
  // first select if the user belongs to an organization
  const membership = await getMembership();
  if (!membership) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const allDocument = await db
    .select({
      id: documents.id,
      organizationId: documents.organizationId,
      name: documents.name,
      fileType: documents.fileType,
      sizeBytes: documents.sizeBytes,
      status: documents.status,
      uploadedBy: documents.uploadedBy,
      uploaded_by_name: user.name,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.organizationId, membership.member.organizationId))
    .innerJoin(user, eq(documents.uploadedBy, user.id));

  const formattedDocuments: DocumentInterface[] = allDocument.map((doc) => {
    const formattedDate = new Date(doc.createdAt);
    const toLocaleStringOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDateTime = formattedDate.toLocaleString(
      "en-US",
      toLocaleStringOptions,
    );

    // make short first name of the user
    let firstName = doc.uploaded_by_name.split(" ")[0];
    let firstLetter = firstName.charAt(0).toUpperCase() + ". ";
    let full_name = firstLetter + doc.uploaded_by_name.split(" ")[1];

    return {
      id: doc.id,
      organizationId: doc.organizationId,
      name: doc.name,
      fileType: doc.fileType,
      sizeBytes: doc.sizeBytes,
      status: doc.status,
      uploadedBy: doc.uploadedBy,
      uploaded_by_name: full_name,
      createdAt: formattedDateTime,
    };
  });
  console.log("formattedDocuments", formattedDocuments);
  return <ShowDocumentData data={formattedDocuments} />;
};

export default Documents;
