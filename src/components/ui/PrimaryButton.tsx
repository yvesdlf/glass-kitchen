import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, isLoading, disabled, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: cn(
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90",
        "shadow-lg shadow-primary/25"
      ),
      secondary: cn(
        "backdrop-blur-md bg-card/60 border border-border/40",
        "text-foreground",
        "hover:bg-card/80"
      ),
      ghost: cn(
        "bg-transparent",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-card/40"
      ),
    };

    return (
      <button
        className={cn(
          "relative flex items-center justify-center gap-2",
          "h-14 w-full px-8 rounded-2xl",
          "text-base font-semibold",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          variants[variant],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-5 w-5 animate-spin absolute" />
        )}
        <span className={cn(isLoading && "opacity-0")}>
          {children}
        </span>
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
