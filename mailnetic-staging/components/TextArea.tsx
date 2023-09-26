import React, { forwardRef, useImperativeHandle, Ref } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  label?: string;
  containerClass?: string;
  className?: string;
}

interface TextAreaRef {
  value: string;
  focus: () => void;
}

const TextArea = forwardRef<TextAreaRef, TextAreaProps>(function TextArea(
  props,
  ref
) {
  const { label, className, containerClass, rows = 2, ...rest } = props;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    value: rest.value.toString() || "",
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  }));

  return (
    <div className={"flex-1 flex flex-col " + containerClass}>
      {label && <p className="text-sm text-black font-medium mb-1">{label}</p>}
      <textarea
        style={{ borderRadius: "15px", height: 40.5 * rows, resize: "none" }}
        ref={inputRef}
        className={"input-default mt-1 resize-non" + className}
        {...rest}
        rows={rows}
      />
    </div>
  );
});

export default TextArea;
