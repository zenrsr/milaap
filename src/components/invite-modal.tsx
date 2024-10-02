import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CopyIcon, RefreshCw } from "lucide-react";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useUpdateJoinCode } from "@/features/workspaces/api/use-update-join-code";
import useConfirm from "@/hooks/use-confirm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
};
const InviteModal = ({ open, setOpen, name, joinCode }: Props) => {
  const workspaceId = useWorkSpaceId();

  const [ConfirmDialog, confirmation] = useConfirm(
    "Are you sure about this? 🤷",
    "This will render the current invite code useless and generate a new code 🌚"
  );

  const { mutate: newJoinCode, isPending: newJoinCodeLoading } =
    useUpdateJoinCode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Link copied to clipboard"));
  };

  const handleNewCode = async () => {
    const ok = await confirmation();
    if (!ok) return;

    newJoinCode(
      { workspaceId },
      {
        onSuccess(data) {
          toast.success("Generated new code successfully");
        },
        onError(error) {
          toast.error("Failed to generate invite code!");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to your {name}{" "}
              <span className="text-muted-foreground">workspace</span>
            </DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              className="gap-2.5"
              size={"sm"}
              variant={"ghost"}
              onClick={handleCopy}
            >
              Copy Link <CopyIcon size={16} />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              className="gap-2.5 group"
              variant={"success"}
              disabled={newJoinCodeLoading}
            >
              New Code
              <RefreshCw className="w-4 h-4 transition-all duration-300 group-hover:rotate-180" />{" "}
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
