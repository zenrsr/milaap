import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { Button } from "./ui/button";
import {
  AlertOctagonIcon,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";

type Props = {
  memberId: Id<"members">;
  onClose: () => void;
};

const Profile = ({ memberId, onClose }: Props) => {
  const router = useRouter();

  const workspaceId = useWorkSpaceId();
  const [LeaveDialog, leaveConfirmation] = useConfirm(
    "Leave Workspace",
    "you sure you wanna leave the workspace"
  );
  const [RemoveDialog, removeConfirmation] = useConfirm(
    "Remove Member",
    "you sure you wanna remove this member"
  );
  const [UpdateDialog, updateConfirmation] = useConfirm(
    "Change Role",
    "you sure you wanna changel this member&apos;s role"
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });

  const { data: member, isLoading: isMemberLoading } = useGetSingleMember({
    id: memberId,
  });
  const { mutate: updateMember, isPending: isMemberUpdating } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isMemberDeleting } =
    useDeleteMember();

  const onRemove = async () => {
    const ok = await removeConfirmation();
    if (!ok) return;
    deleteMember(
      { id: memberId },
      {
        onSuccess(data) {
          toast.success("member removed!");
          onClose();
        },
        onError(error) {
          toast.error("Failed to remove member!");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await leaveConfirmation();
    if (!ok) return;
    deleteMember(
      { id: memberId },
      {
        onSuccess(data) {
          router.replace("/");
          toast.success("You left the workspace!");
          onClose();
        },
        onError(error) {
          toast.error("Failed to leave the workspace!");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await updateConfirmation();
    if (!ok) return;
    updateMember(
      { id: memberId, role: role },
      {
        onSuccess(data) {
          toast.success("member role updated!");
          onClose();
        },
        onError(error) {
          toast.error("Failed to update member role!");
        },
      }
    );
  };

  if (isMemberLoading || isLoadingCurrentMember)
    return (
      <div className="h-full flex flex-col bg-neutral-50">
        <div className="flex justify-between h-[49px] items-center px-4 border-b">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!member) {
    return (
      <div className="h-full flex flex-col bg-neutral-50">
        <div className="flex justify-between h-[49px] items-center px-4 border-b">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertOctagonIcon className="size-8 animate-bounce text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No profile found</p>
        </div>
      </div>
    );
  }

  const fallBack = member.user.name?.charAt(0).toUpperCase() ?? "M";

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col bg-neutral-50">
        <div className="flex justify-between h-[49px] items-center px-4 border-b">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center p-4 justify-center">
          <Avatar className="max-w-[250px] max-h-[250px] rounded-full size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {fallBack}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full capitalize" variant={"outline"}>
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="w-full"
                variant={"ghost"}
                onClick={() => onRemove()}
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button
                className="w-full"
                variant={"ghost"}
                onClick={() => onLeave()}
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-xs font-bold mb-4 ">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-xs hover:underline text-[#126483]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
