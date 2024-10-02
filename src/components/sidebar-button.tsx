import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons/lib";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
};

const SidebarButton = ({ icon: Icon, label, isActive }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant={"transparent"}
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20"
        )}
      >
        <Icon className="size-5 text-neutral-100 group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-[11px] text-neutral-100 group-hover:text-accent">
        {label}
      </span>
    </div>
  );
};

export default SidebarButton;
