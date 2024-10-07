import React from "react";
import { Button } from "./ui/button";
import {
  Edit3Icon,
  MessageSquareCodeIcon,
  SmilePlusIcon,
  Trash2Icon,
} from "lucide-react";
import Hint from "./hint";
import EmojiPop from "./emoji-pop";

type Props = {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  hideThreadButton?: boolean;
  handleReaction: (value: string) => void;
};

const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: Props) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="flex items-center group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-xl">
        <EmojiPop
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <SmilePlusIcon className="size-4" />
          </Button>
        </EmojiPop>
        {!hideThreadButton && (
          <Hint label="Reply">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareCodeIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit Message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleEdit}
            >
              <Edit3Icon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete Message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};

export default MessageToolbar;
