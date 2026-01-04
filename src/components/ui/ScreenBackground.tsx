import * as React from "react";
import { cn } from "@/lib/utils";

interface ScreenBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ScreenBackground = React.forwardRef<HTMLDivElement, ScreenBackgroundProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen w-full relative overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Gradient background layers - warm brown palette */}
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/80 via-primary/30 to-accent/20" />
        <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-primary/10" />
        
        {/* Subtle texture overlay */}
        <div className="fixed inset-0 backdrop-blur-3xl opacity-20" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

ScreenBackground.displayName = "ScreenBackground";

export { ScreenBackground };
