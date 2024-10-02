"use client";
import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkSpaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import {
  BellDotIcon,
  Home,
  MessageCircleCode,
  MoreHorizontalIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-black-1 flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkSpaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageCircleCode} label="DM's" />
      <SidebarButton icon={BellDotIcon} label="Alerts" />
      <SidebarButton icon={MoreHorizontalIcon} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
