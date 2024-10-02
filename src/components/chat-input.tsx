import dynamic from "next/dynamic";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
import React, { useRef } from "react";

type Props = {
  placeholder: string;
};

const ChatInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);
  //   editorRef.current?.focus();

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
