import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useImageGenerateUrl } from "@/features/upload/api/use-image-generate-url";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

type Props = {
  placeholder: string;
  conversationId: Id<"conversations">;
};

type CreateMessage = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const ConvoChatInput = ({ placeholder, conversationId }: Props) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState<boolean>(false);
  const workspaceId = useWorkSpaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useImageGenerateUrl();

  const editorRef = useRef<Quill | null>(null);
  //   editorRef.current?.focus();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessage = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image!");

        const { storageId } = await result.json();

        console.log({ storageId });

        values.image = storageId;
      }

      console.log({ values });

      await createMessage(values, { throwError: true });

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message!");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ConvoChatInput;
