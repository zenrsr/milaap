import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
};

const EmojiPop = ({ children, hint = "Emoji", onEmojiSelect }: Props) => {
  const [popOpen, setPopOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <div>
      <TooltipProvider>
        <Popover open={popOpen} onOpenChange={setPopOpen}>
          <Tooltip
            open={tooltipOpen}
            onOpenChange={setTooltipOpen}
            delayDuration={50}
          >
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>{children}</TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent className="bg-black text-white border border-white/5">
              <p className="text-xs font-medium">{hint}</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="p-0 w-full border-none shadow-none">
            {/* <EmojiPicker onEmojiClick={onSelect} /> */}
            <Picker data={data} onEmojiSelect={onSelect} />
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  );
};

export default EmojiPop;
