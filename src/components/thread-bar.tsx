import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRightCircle } from "lucide-react";

type Props = {
  count?: number;
  image?: string;
  name?: string;
  timestamp?: number;
  onClick?: () => void;
};

const ThreadBar = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}: Props) => {
  const fallBack = name.charAt(0).toUpperCase();

  if (!count || !timestamp) return null;
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-neutral-100 border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0 rounded-full">
          <AvatarImage src={image} />
          <AvatarFallback>{fallBack}</AvatarFallback>
        </Avatar>
        {/* <Edit2Icon className="size-4 items-center" />{" "} */}

        <span className="flex items-center justify-evenly text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies..." : "reply..."}{" "}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply from {formatDistanceToNow(timestamp, { addSuffix: true })}.
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRightCircle className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};

export default ThreadBar;
