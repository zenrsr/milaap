"use client";

import Sidebar from "@/components/sidebar";
import Thread from "@/components/thread";
import Toolbar from "@/components/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/components/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  children: React.ReactNode;
};

const Workspacelayout = ({ children }: Props) => {
  const { parentMessageId, onCloseMessage, onOpenMessage } = usePanel();

  const showPanel = !!parentMessageId;

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
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Workspacelayout;
