"use client";

import Sidebar from "@/components/sidebar";
import Toolbar from "@/components/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/components/workspace-sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Workspacelayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)] ">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"sample-layout"}
        >
          <ResizablePanel
            defaultSize={21}
            minSize={11}
            maxSize={25}
            className="bg-black-1/50"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Workspacelayout;
