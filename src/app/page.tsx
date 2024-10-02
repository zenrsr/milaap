"use client";

import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { usegetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = usegetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      console.log("redirect to worksapce...");
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    } else {
      console.log("Open create workspace modal");
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div className="flex justify-center items-center gap-2 h-1/2">
      <UserButton />
    </div>
  );
}
