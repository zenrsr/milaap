import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemsvariants>["variant"];
};

const userItemsvariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4  text-sm oberflow-hidden",
  {
    variants: {
      variant: {
        default: "text-white",
        active: "text-black-3 bg-white/90 hover:bg-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const UserItem = ({ id, label = "Member", image, variant }: Props) => {
  const workspaceId = useWorkSpaceId();
  const avatarFalssback = label.charAt(0).toUpperCase();
  return (
    <Button
      variant={"transparent"}
      className={cn(userItemsvariants({ variant }))}
      size={"sm"}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="bg-gray-900 text-white font-semibold font-mono rounded-md text-xs">
            {avatarFalssback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
