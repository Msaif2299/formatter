import { LabelProps } from "@radix-ui/react-label";
import { Label } from "./ui/label";

export default function CenterLabel({ children, className = "", ...props }: LabelProps) {
    return (
      <Label className={`pt-3 ${className}`.trim()} {...props}>
        {children}
      </Label>
    );
  };