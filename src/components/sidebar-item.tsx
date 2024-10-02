import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "./ui/button";
import Link from "next/link";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemsvariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm oberflow-hidden",
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

type Props = {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemsvariants>["variant"];
};

const SidebarItem = ({ label, icon: Icon, id, variant }: Props) => {
  const workspaceId = useWorkSpaceId();

  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      className={cn(sidebarItemsvariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
