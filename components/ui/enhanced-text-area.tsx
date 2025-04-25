"use client";
import * as React from "react";
import { Textarea } from "./textarea";

const TAB_SPACE = 4;

type EnhancedTextAreaProps = React.ComponentProps<"textarea"> & {
  onChangeHandler?: (value: string) => void;
  value?: string;
  setValue?: (value: string) => void;
};


const EnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EnhancedTextAreaProps
>(({ className, onChangeHandler, value, setValue, ...props }, ref) => {
  if (value === undefined || setValue === undefined) {
    [value, setValue] = React.useState("");
  }
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  React.useImperativeHandle(
    ref,

    () => textAreaRef.current as HTMLTextAreaElement
  );

  const updateValueAndCursor = (
    newValue: string,
    newPosition: number,
    target: HTMLTextAreaElement
  ) => {
    setValue(newValue);
    requestAnimationFrame(() => {
      target.selectionStart = newPosition;
      target.selectionEnd = newPosition;
    });
    if (onChangeHandler) {
      onChangeHandler(newValue);
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateValueAndCursor(
      e.currentTarget.value,
      e.currentTarget.selectionStart || 0,
      e.currentTarget
    );
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      const position = e.currentTarget.selectionStart || 0;

      e.preventDefault();
      const newText =
        e.currentTarget.value.substring(0, position) +
        " ".repeat(TAB_SPACE) +
        e.currentTarget.value.substring(position);

      updateValueAndCursor(newText, position + TAB_SPACE, e.currentTarget);
    } else if (e.key === "Enter") {
      const position = e.currentTarget.selectionStart || 0;
      e.preventDefault();
      // find number of tabs on last line
      const spaceLineSplit = e.currentTarget.value
        .substring(0, position)
        .split("\n");
      const spaceLine = spaceLineSplit[spaceLineSplit.length - 1];
      let tabCount = 0;
      for (let index = 0; index < spaceLine.length; index++) {
        if (spaceLine[index] != " ") {
          break;
        }
        tabCount++;
      }
      tabCount = ~~(tabCount / TAB_SPACE);
      const newText =
        e.currentTarget.value.substring(0, position) +
        "\n" +
        " ".repeat(tabCount * TAB_SPACE) +
        e.currentTarget.value.substring(position);
      updateValueAndCursor(
        newText,
        position + tabCount * TAB_SPACE + 1,
        e.currentTarget
      );
    }
  };

  return (
    <Textarea
      ref={textAreaRef}
      value={value}
      onChange={handleKeyChange}
      onKeyDown={handleTab}
      {...props}
    />
  );
});

export { EnhancedTextarea };
