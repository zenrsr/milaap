import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import ConversationHeader from "./conversation-header";
import ConvoChatInput from "@/app/workspace/[workspaceId]/member/[memberId]/convo-chat-input";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import MessageList from "./message-list";

type Props = {
  id: Id<"conversations">;
};

const Conversation = ({ id }: Props) => {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetSingleMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });
  const { data: currentAuthMember, isLoading: currentAuthMemberLoading } =
    useCurrentUser();

  if (
    memberLoading ||
    status === "LoadingFirstPage" ||
    currentAuthMemberLoading
  )
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );

  const name =
    currentAuthMember?.name === member?.user.name &&
    currentAuthMember?.image === member?.user.image &&
    currentAuthMember?.email === member?.user.email
      ? "Yourself"
      : member?.user.name;

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        memberEmail={member?.user.email}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        variant="conversation"
        memeberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ConvoChatInput placeholder={`Message ${name}...`} conversationId={id} />
    </div>
  );
};

export default Conversation;
