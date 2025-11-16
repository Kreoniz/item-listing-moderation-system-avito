import { cn } from "@/lib/utils";
import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-secondary relative h-2 w-full overflow-hidden rounded-full",
          className,
        )}
        {...props}
      >
        <div
          className="bg-primary h-full w-full flex-1 transition-all duration-300 ease-in-out"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
