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
        {/* Gradient background layers */}
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-primary/40" />
        <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-primary/20" />
        
        {/* Blur overlay for depth */}
        <div className="fixed inset-0 backdrop-blur-3xl opacity-30" />
        
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
