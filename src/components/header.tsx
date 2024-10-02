import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaChevronCircleDown } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Edit3Icon, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

type Props = {
  channelName: string;
};

const Header = ({ channelName }: Props) => {
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(channelName);
  const [ConfirmDialog, confirmation] = useConfirm(
    "Delete this channel",
    "Your are about to delete this channel and can not be undone"
  );

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel();
  const { mutate: deleteChannel, isPending: deletingChannel } =
    useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handelDelete = async () => {
    const ok = await confirmation();
    if (!ok) return;

    deleteChannel(
      { id: channelId },
      {
        onSuccess(data) {
          toast.success("Channel Deleted ⭕");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete the channel");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess() {
          toast.success("Channel name updated successfully ⭕");
          setEditOpen(false);
        },
        onError(error) {
          toast.error("failed to update channel name");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger>
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}
          >
            <span className="truncate"># {channelName}</span>
            <FaChevronCircleDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-neutral-200 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {channelName}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2.5">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-opacity-75">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && <Edit3Icon />}
                  </div>
                  <p className="text-sm">
                    #{" "}
                    <span className="text-muted-foreground">{channelName}</span>
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={updatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={4}
                    maxLength={25}
                    placeholder="eg: memes"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button disabled={updatingChannel}>Cancel</Button>
                    </DialogClose>
                    <Button disabled={updatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handelDelete}
                disabled={deletingChannel}
                className="flex items-center  gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer vorder hover:bg-opacity-50 text-rose-700"
              >
                <Trash2 className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
