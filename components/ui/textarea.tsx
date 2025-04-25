import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Clipboard, Check } from "lucide-react";
import { useState } from "react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const [showCopied, setShowCopied] = useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const copyToClipboard = async () => {
    textAreaRef.current?.select();
    try {
      if (textAreaRef?.current?.value !== undefined) {
        await navigator.clipboard.writeText(textAreaRef?.current?.value);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={(element) => {
          // Handle both refs
          textAreaRef.current = element;
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        {...props}
      />
      <div className="absolute top-2 right-2">
        {showCopied ? (
          <div className="animate-in fade-in-0 slide-in-from-top-1 duration-200">
            <Button
              size="icon"
              variant="ghost"
              className="pointer-events-none bg-green-500/10 text-green-500"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={copyToClipboard}
            className="opacity-70 hover:opacity-90 transition-opacity"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
