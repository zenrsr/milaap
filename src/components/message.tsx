import React from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./hint";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Thumbnail from "./thumb-nail";
import MessageToolbar from "./message-toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import useConfirm from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  authorEmail?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  threadCount,
  threadImage,
  threadTimestamp,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  isAuthor,
  authorEmail,
}: Props) => {
  const { data: currentAuthMember, isLoading: currentAuthMemberLoading } =
    useCurrentUser();

  const avatarFalssback = authorName.charAt(0).toUpperCase();

  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();

  const [ConfirmDialog, confirmation] = useConfirm(
    "Delete Message",
    "You sure you wanna delete this message?"
  );

  const { mutate: updateMessage, isPending: isMessageUpdating } =
    useUpdateMessage();

  const { mutate: deleteMessage, isPending: isMessageDeleting } =
    useDeleteMessage();

  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isMessageUpdating;

  const name =
    currentAuthMember?.name === authorName &&
    currentAuthMember?.image === authorImage &&
    currentAuthMember?.email === authorEmail
      ? `${authorName} (Me)`
      : authorName;

  const handleDelete = async () => {
    const ok = await confirmation();
    if (!ok) return;

    deleteMessage(
      {
        id,
      },
      {
        onSuccess(data) {
          toast.success("Deleted message!");
          if (parentMessageId === id) onCloseMessage();
        },
        onError(error) {
          toast.error("Failed to delete message!");
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess(data) {
          toast.success("Message updated successfully!");
          setEditingId(null);
        },
        onError(error) {
          toast.error("Failed to update message!");
        },
      }
    );
  };

  const handleReaction = (value: string) => [
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError(error) {
          toast.success("Failed to toggle reaction");
        },
      }
    ),
  ];

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative",
            isEditing && "bg-[#ebffef] hover:bg-[#ebffef]",
            isMessageDeleting &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))} side="left">
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground italic">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative",
            isEditing && "bg-[#ebffef] hover:bg-[#ebffef]",
            isMessageDeleting &&
              "bg-gray-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <button>
              <Avatar>
                <AvatarImage src={authorImage} />
                <AvatarFallback className="font-semibold font-mono text-xs">
                  {avatarFalssback}
                </AvatarFallback>
              </Avatar>
            </button>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full overflow-hidden">
                <div className="text-sm">
                  <button
                    className="font-bold text-primary hover:underline"
                    onClick={() => {}}
                  >
                    {name}
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <Hint
                    label={formatFullTime(new Date(createdAt))}
                    side="right"
                  >
                    <button className="text-xs text-muted-foreground hover:underline">
                      {format(new Date(createdAt), "h:mm a")}
                    </button>
                  </Hint>
                </div>
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground italic">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
};

export default Message;
