import Quill from "quill";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
};

const Renderer = ({ value }: Props) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const renderRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    // Create a temporary div for Quill initialization
    const tempContainer = document.createElement("div");

    // Initialize Quill only once
    if (!quillRef.current) {
      quillRef.current = new Quill(tempContainer, { theme: "snow" });
      quillRef.current.enable(false);
    }

    try {
      const contents = JSON.parse(value);
      quillRef.current.setContents(contents);

      const isEmpty =
        quillRef.current
          .getText()
          .replace(/<(.|\n)*?>/g, "")
          .trim().length === 0;

      setIsEmpty(isEmpty);

      // Only update innerHTML if the ref is available
      if (renderRef.current) {
        renderRef.current.innerHTML = quillRef.current.root.innerHTML;
      }
    } catch (error) {
      console.error("Error rendering message:", error);
      setIsEmpty(true);
    }

    // Cleanup function
    return () => {
      if (renderRef.current) {
        renderRef.current.innerHTML = "";
      }
    };
  }, [value]);

  // If empty, return null early
  if (isEmpty) return null;

  return <div ref={renderRef} className="ql-editor ql-renderer" />;
};

export default Renderer;
