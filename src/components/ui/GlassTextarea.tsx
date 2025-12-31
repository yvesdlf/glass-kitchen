import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex w-full min-h-[200px] rounded-2xl",
            "backdrop-blur-md bg-card/60 border border-border/40",
            "px-4 py-3 text-base font-medium font-mono",
            "text-foreground placeholder:text-muted-foreground/50",
            "transition-all duration-200 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

GlassTextarea.displayName = "GlassTextarea";

export { GlassTextarea };
