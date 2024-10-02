import { useCurrentMember } from "@/features/members/api/use-current-member";
import { usegetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import {
  AlertOctagonIcon,
  HashIcon,
  Loader,
  MessageSquareTextIcon,
  SendHorizontalIcon,
} from "lucide-react";
import React from "react";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";

type Props = {};

const WorkspaceSidebar = (props: Props) => {
  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = usegetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading)
    return (
      <div className="flex flex-col bg-black-3/50 h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-neutral-100" />
      </div>
    );

  if (!workspace || !member)
    return (
      <div className="flex flex-col gap-y-2.5 bg-rose-700/60 h-full items-center justify-center">
        <AlertOctagonIcon className="size-16 animate-bounce text-neutral-100" />
        <p className="text-neutral-100 font-semibold text-lg">
          Workspace not found
        </p>
      </div>
    );

  return (
    <div className="flex flex-col bg-black-3/50 h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3 gap-2.5">
        <SidebarItem
          label="Threads"
          icon={MessageSquareTextIcon}
          id="threads"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizontalIcon}
          id="threads"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((channelItem) => (
          <SidebarItem
            key={channelItem._id}
            label={channelItem.name}
            icon={HashIcon}
            id={channelItem._id}
            variant={channelId === channelItem._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
