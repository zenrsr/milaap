"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Info, SearchIcon } from "lucide-react";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { usegetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

type Props = {};

const Toolbar = (props: Props) => {
  const router = useRouter();

  const workspaceId = useWorkSpaceId();
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: memebers } = useGetMembers({ workspaceId });
  const { data } = usegetWorkspace({ id: workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-black-1 text-neutral-50 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search {data?.name} Workspace
          </span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  # {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Memebers">
              {memebers?.map((member) => (
                <CommandItem
                  key={member._id}
                  className="gap-2"
                  onSelect={() => onMemberClick(member._id)}
                >
                  <Avatar className="rounded-full size-6">
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
