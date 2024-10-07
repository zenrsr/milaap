import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import React, { useState } from "react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./message";
import ChannelHero from "./channel-hero";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Loader } from "lucide-react";
import ConvoHero from "./convo-hero";

export const TIME_THRESHOLD = 25;

type Props = {
  memberName?: string;
  memeberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  data: GetMessagesReturnType | undefined;
  variant?: "channel" | "thread" | "conversation";
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
};

export const formatDateLabel = (x: string) => {
  const date = new Date(x);
  if (isToday(date)) return "Today";

  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEEE, MMMM, d");
};

const MessageList = ({
  memberName,
  memeberImage,
  channelName,
  channelCreationTime,
  data,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
}: Props) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkSpaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-muted-foreground border border-neutral-400 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, idx) => {
            const previousMessage = messages[idx - 1];
            const isCompact =
              previousMessage &&
              previousMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(previousMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={idx}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                authorEmail={message.user.email}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                createdAt={message._creationTime}
                updatedAt={message.updatedAt}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            );
          })}
        </div>
      ))}

      <div
        onClick={loadMore}
        className="h-1"
        ref={(element) => {
          if (element) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(element);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-muted-foreground border border-neutral-400 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}

      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && (
        <ConvoHero name={memberName} image={memeberImage} />
      )}
    </div>
  );
};

export default MessageList;
