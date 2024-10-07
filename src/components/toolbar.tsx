"use client";
import React from "react";
import { Button } from "./ui/button";
import { Info, SearchIcon } from "lucide-react";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { usegetWorkspace } from "@/features/workspaces/api/use-get-workspace";

type Props = {};

const Toolbar = (props: Props) => {
  const workspaceId = useWorkSpaceId();
  const { data } = usegetWorkspace({ id: workspaceId });
  return (
    <nav className="bg-black-1 text-neutral-50 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search {data?.name} Workspace
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
