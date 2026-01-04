import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

interface WastageIndicatorProps {
  percentage: number;
  label?: string;
  threshold?: number;
}

export function WastageIndicator({ 
  percentage, 
  label = "Average Wastage",
  threshold = 5 
}: WastageIndicatorProps) {
  const isHigh = percentage > threshold;
  const isModerate = percentage > threshold * 0.6 && percentage <= threshold;
  
  const getStatus = () => {
    if (isHigh) return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "High" };
    if (isModerate) return { icon: TrendingDown, color: "text-accent", bg: "bg-accent/10", label: "Moderate" };
    return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Good" };
  };
  
  const status = getStatus();

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${status.bg} flex items-center justify-center`}>
          <status.icon className={`h-7 w-7 ${status.color}`} />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{percentage.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Target: &lt;{threshold}%</p>
        </div>
      </div>
    </GlassCard>
  );
}
