import React, { forwardRef, useImperativeHandle } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClass?: string;
}

export interface InputRef {
  value: string;
  focus: () => void;
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { label, containerClass, className, style, ...rest } = props;

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
      <input
        ref={inputRef}
        className={"input-default mt-1 " + className}
        style={{ height: "52px", ...style }}
        {...rest}
      />
    </div>
  );
});

export default Input;
