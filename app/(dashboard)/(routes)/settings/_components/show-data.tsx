import { Header } from "@/components/header";
import React from "react";
import WorkspaceSetting from "./workspace-setting";
import TeamMembers from "./team-members";

type WorkspaceProps = {
  id: string;
  name: string;
  slug: string;
  uploaded_bytes: number;
  questions_used: number;
}[];
const ShowSettingsData = ({ workspace }: { workspace: WorkspaceProps }) => {
  return (
    <div className="flex-1 sm:p-2 overflow-auto">
      <Header title="Settings" description="Workspace, plan and team access" />
      <div className="mt-4 sm:px-2 flex flex-col gap-4">
        {/* workspace component */}
        <div>
          <WorkspaceSetting workspace={workspace} />
        </div>
        {/* Team members component */}
        <div className="mb-3">
          <TeamMembers />
        </div>
      </div>
    </div>
  );
};

export default ShowSettingsData;
