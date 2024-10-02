"use client";

import React from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetIndividualChannels } from "@/features/channels/api/use-get-individiual-channel";
import { Loader, TriangleAlertIcon } from "lucide-react";
import Header from "@/components/header";
import ChatInput from "@/components/chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetIndividualChannels(
    { id: channelId }
  );

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">Channel not Found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header channelName={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
