import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { MemberTable } from "./member-table";

const TeamMembers = () => {
  return (
    <Card className="w-full rounded-md py-4 px-0 gap-3">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col">
          <b className="text-sm font-semibold">Team members</b>
          <span className="text-xs text-muted-foreground">
            24 people can access this workspace
          </span>
        </div>
        {/* button */}
        <Button
          variant="default"
          className={`hover:${styles.primaryBgColor} cursor-pointer rounded-sm`}
        >
          Invite member
        </Button>
      </CardHeader>
      <CardContent className="w-full">
        <MemberTable />
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
