"use client";

import { useUpsertConversation } from "@/features/conversations/api/use-upsert-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlertIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversation from "@/components/conversation";

type Props = {
  params: {
    memberId: number;
  };
};

const MemberIdPage = (props: Props) => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();

  const { mutate, isPending } = useUpsertConversation();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError(error) {
          toast.error("Failed to get conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending)
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );

  if (!conversationId)
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          Conversation not Found
        </span>
      </div>
    );

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
