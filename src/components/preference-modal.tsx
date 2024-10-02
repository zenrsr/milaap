import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
};

const PreferenceModal = ({ open, setOpen, initialValue }: Props) => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [value, setValue] = useState(initialValue);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [ConfirmDialog, confirmation] = useConfirm(
    "Are you sure about that?",
    "This action is irreversible!."
  );

  const handleDelete = async () => {
    const ok = await confirmation();
    console.log({ ok });

    if (!ok) return;

    deleteWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("Workspace deleted successfully");
        },
        onError: (error) => {
          toast.error("Failed to delete workspace!");
        },
      }
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace name updated");
          setEditOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update workspace name!");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-100 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-neutral-100">
            <DialogTitle>
              {value}{" "}
              <span className="text-sm text-muted-foreground">workspace</span>
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace Name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={69}
                    placeholder="Workspace name e.g 'Work', 'Personal', 'Deep'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <button
            disabled={isDeletingWorkspace}
            onClick={handleDelete}
            className="flex items-center gap-x-2 mx-4 p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100 text-rose-600"
          >
            <Trash2Icon className="szie-4" />
            <p className="text-sm font-semibold">Delete Workspace</p>
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferenceModal;
