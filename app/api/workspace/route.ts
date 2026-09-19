import { getUser } from "@/lib/actions/get-user";
import { createWorkspace } from "@/lib/actions/workspace-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  const { workspace_name } = await request.json();
  try {
    const organization = await createWorkspace(workspace_name);
    return NextResponse.json(
      {
        status: "success",
        data: organization,
        message: "Workspace created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create workspace",
      },
      { status: 500 },
    );
  }
}
