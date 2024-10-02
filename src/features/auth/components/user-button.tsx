"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader2, LogOutIcon } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const UserButton = (props: Props) => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();
  if (isLoading) {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!data) return null;

  const { name, image, email } = data;

  const avatarFallaback = name!.charAt(0).toUpperCase();
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="roudned-md size-10 hover:opacity-75 transition">
          <AvatarImage alt="name" src={image} />
          <AvatarFallback className="bg-gray-900 rounded-md text-white font-semibold font-mono">
            {avatarFallaback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem
          onClick={() =>
            signOut().then(() => {
              router.replace("/auth"); // Redirect to the Auth page after signing out
            })
          }
          className="cursor-pointer"
        >
          <LogOutIcon className="size-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
