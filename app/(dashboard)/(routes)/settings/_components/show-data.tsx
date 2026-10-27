import { Header } from "@/components/header";
import React from "react";
import WorkspaceSetting from "./workspace-setting";

const ShowSettingsData = () => {
  return (
    <div className="flex-1 sm:p-2">
      <Header title="Settings" description="Workspace, plan and team access" />
      <div className="mt-4 sm:px-2">
        {/* workspace component */}
        <div>
          <WorkspaceSetting />
        </div>
        {/* Team members component */}
        <div></div>
      </div>
    </div>
  );
};

export default ShowSettingsData;
