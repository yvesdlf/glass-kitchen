import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent";
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default" 
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-card/60",
    primary: "bg-primary/10 border-primary/20",
    accent: "bg-accent/10 border-accent/20",
  };

  return (
    <GlassCard className={`p-5 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-destructive'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          variant === "primary" ? "bg-primary/20" : 
          variant === "accent" ? "bg-accent/20" : 
          "bg-muted/30"
        }`}>
          <Icon className={`h-5 w-5 ${
            variant === "primary" ? "text-primary" : 
            variant === "accent" ? "text-accent" : 
            "text-muted-foreground"
          }`} />
        </div>
      </div>
    </GlassCard>
  );
}
