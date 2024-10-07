import React from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import Hint from "./hint";
import EmojiPop from "./emoji-pop";
import { SmilePlusIcon } from "lucide-react";

type Props = {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
};

const Reactions = ({ data, onChange }: Props) => {
  const workspaceId = useWorkSpaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;
  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              reaction.memberIds.includes(currentMemberId) &&
                "bg-blue-100/70 border-blue-500"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPop
        hint="add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-6 px-3 rounded-full bg-slate-200/70 border border-transparent hover:broder-slate-500 text-slate-800 flex items-center gap-x-1">
          <SmilePlusIcon className="size-4" />
        </button>
      </EmojiPop>
    </div>
  );
};

export default Reactions;
