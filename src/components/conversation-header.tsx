import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronDown } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

type Props = {
  memberName?: string;
  memberImage?: string;
  memberEmail?: string;
  onClick?: () => void;
};

const ConversationHeader = ({
  memberName = "Member",
  memberImage,
  memberEmail,
  onClick,
}: Props) => {
  const { data } = useCurrentUser();
  const avatarFallback = memberName.charAt(0).toUpperCase();

  const name =
    data?.name === memberName &&
    data.image === memberImage &&
    data.email === memberEmail
      ? "Saved Messages"
      : memberName;

  return (
    <div className="bg-neutral-100 border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{name}</span>
        <ChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
