import { GlassCard } from "@/components/ui/GlassCard";
import { Progress } from "@/components/ui/progress";

interface CostBreakdownItem {
  label: string;
  value: number;
  total: number;
  color: "primary" | "accent" | "muted" | "secondary";
}

interface FoodCostChartProps {
  items: CostBreakdownItem[];
  title?: string;
}

export function FoodCostChart({ items, title = "Cost Breakdown" }: FoodCostChartProps) {
  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    muted: "bg-muted",
    secondary: "bg-secondary",
  };

  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colorClasses[item.color]} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
