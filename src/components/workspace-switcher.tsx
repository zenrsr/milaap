import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { usegetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { usegetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

type Props = {};

const WorkSpaceSwitcher = (props: Props) => {
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useWorkSpaceId();
  const { data: workspaces, isLoading: workspacesLoading } = usegetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = usegetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-black-3/80 hover:bg-black-3 transition-all text-neutral-50 font-semibold text-xl focus-visible:ring-0 focus-visible:ring-offset-0">
          {workspaceLoading ? (
            <Loader2 className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          {workspace?.name} Workspace
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer gap-4"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-neutral-500 text-neutral-100 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate capitalize">
              {workspace.name}{" "}
              <span className="text-muted-foreground lowercase">workspace</span>
            </p>
          </DropdownMenuItem>
        ))}
        <Separator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-neutral-200 text-muted-foreground text-lg rounded-md flex items-center justify-center mr-2">
            <PlusIcon />
          </div>
          Create a new Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceSwitcher;
