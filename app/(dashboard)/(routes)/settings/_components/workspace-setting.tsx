import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const WorkspaceSetting = () => {
  return (
    <Card className="w-full rounded-md py-4 px-0">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Workspace Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Workspace Name</Label>
          <Input placeholder="Workspace Name" className="mt-2" />
        </div>
        <div>
          <Label>Plan</Label>
          <p className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40">
            <strong className="font-semibold mr-2">Free</strong>
            <span>3,000 questions / month</span>
          </p>
          {/* <Input disabled className="mt-2" /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceSetting;
