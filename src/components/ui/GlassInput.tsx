import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, icon: Icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-2xl",
            "backdrop-blur-md bg-card/60 border border-border/40",
            "px-4 py-3 text-base font-medium",
            "text-foreground placeholder:text-muted-foreground/50",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-12",
            rightElement && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };
