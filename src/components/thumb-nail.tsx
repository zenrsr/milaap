/*eslint-disable @next/next/no-img-element */

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  url: string | null | undefined;
};

const Thumbnail = ({ url }: Props) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-zoom-in relative overflow-hidden max-w-[360px] border rounded-lg my-2 hover:cursor-zoom-in">
          <img
            src={url}
            alt="mesage Image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="mesage Image"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
