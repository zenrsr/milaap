import React, { useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { AlertCircleIcon, Loader, XIcon } from "lucide-react";
import { useGetSingleMessage } from "@/features/messages/api/use-get-single-message";
import Message from "./message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useImageGenerateUrl } from "@/features/upload/api/use-image-generate-url";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format } from "date-fns";
import { formatDateLabel, TIME_THRESHOLD } from "./message-list";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
  messageId: Id<"messages">;
  onClose: () => void;
};

type CreateMessage = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Thread = ({ messageId, onClose }: Props) => {
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useImageGenerateUrl();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: threadMessage, isLoading: isMessageLoading } =
    useGetSingleMessage({ id: messageId });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessage = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image!");

        const { storageId } = await result.json();

        console.log({ storageId });

        values.image = storageId;
      }

      console.log({ values });

      await createMessage(values, { throwError: true });

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message!");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  const groupMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (isMessageLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex flex-col bg-neutral-50">
        <div className="flex justify-between h-[49px] items-center px-4 border-b">
          <p className="text-xl font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!threadMessage) {
    return (
      <div className="h-full flex flex-col bg-neutral-50">
        <div className="flex justify-between h-[49px] items-center px-4 border-b">
          <p className="text-xl font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertCircleIcon className="size-5 animate-bounce text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No messages found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="flex justify-between h-[49px] items-center px-4 border-b">
        <p className="text-xl font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  createdAt={message._creationTime}
                  updatedAt={message.updatedAt}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
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

        <Message
          hideThreadButton
          memberId={threadMessage.memberId}
          authorImage={threadMessage.user.image}
          authorName={threadMessage.user.name}
          isAuthor={threadMessage.memberId === currentMember?._id}
          body={threadMessage.body}
          image={threadMessage.image}
          createdAt={threadMessage._creationTime}
          updatedAt={threadMessage.updatedAt}
          id={threadMessage._id}
          reactions={threadMessage.reactions}
          isEditing={editingId === threadMessage._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="reply..."
        />
      </div>
    </div>
  );
};

export default Thread;
