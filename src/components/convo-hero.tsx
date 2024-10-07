import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  name?: string;
  image?: string;
};

const ConvoHero = ({ name = "Member", image }: Props) => {
  const fallBack = name.charAt(0).toUpperCase();
  return (
    <div className="mt-[88px] mx-5  mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback>{fallBack}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800">
        This is the start of the conversation between you and{" "}
        <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConvoHero;
