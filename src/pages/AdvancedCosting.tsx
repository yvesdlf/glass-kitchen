import { useState, useMemo } from "react";
import { RecipeIngredient } from "@/models/IngredientPrice";
import { IngredientList } from "@/components/recipe/IngredientList";
import { ScalingControl } from "@/components/recipe/ScalingControl";
import { CostingSection } from "@/components/recipe/CostingSection";
import { YieldInput } from "@/components/recipe/YieldInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FoodCostChart } from "@/components/dashboard/FoodCostChart";
import { Calculator, DollarSign, Percent, Target, TrendingUp, UtensilsCrossed } from "lucide-react";

export default function AdvancedCosting() {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [laborCost, setLaborCost] = useState(0);
  const [overheadPercent, setOverheadPercent] = useState(0);
  const [targetFoodCostPercent, setTargetFoodCostPercent] = useState(30);
  const [yieldQuantity, setYieldQuantity] = useState(1);
  const [yieldUnit, setYieldUnit] = useState("portions");

  // Calculate real-time metrics
  const metrics = useMemo(() => {
    const ingredientCost = ingredients.reduce((sum, ing) => 
      sum + ((ing.true_cost || ing.price_per_unit || 0) * ing.quantity * multiplier), 0
    );
    const scaledLabor = laborCost * multiplier;
    const overhead = (ingredientCost + scaledLabor) * (overheadPercent / 100);
    const totalCost = ingredientCost + scaledLabor + overhead;
    const costPerPortion = yieldQuantity > 0 ? totalCost / (yieldQuantity * multiplier) : 0;
    const suggestedPrice = targetFoodCostPercent > 0 
      ? costPerPortion / (targetFoodCostPercent / 100) 
      : 0;
    const profitMargin = suggestedPrice > 0 
      ? ((suggestedPrice - costPerPortion) / suggestedPrice) * 100 
      : 0;

    return {
      ingredientCost,
      scaledLabor,
      overhead,
      totalCost,
      costPerPortion,
      suggestedPrice,
      profitMargin,
    };
  }, [ingredients, multiplier, laborCost, overheadPercent, yieldQuantity, targetFoodCostPercent]);

  // Chart data for cost breakdown
  const costBreakdownItems = [
    { label: "Ingredients", value: metrics.ingredientCost, total: metrics.totalCost, color: "primary" as const },
    { label: "Labor", value: metrics.scaledLabor, total: metrics.totalCost, color: "accent" as const },
    { label: "Overhead", value: metrics.overhead, total: metrics.totalCost, color: "secondary" as const },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Advanced Recipe Costing</h2>
            <p className="text-sm text-muted-foreground">Real-time cost analysis, scaling & pricing recommendations</p>
          </div>
        </div>
      </GlassCard>

      {/* Live Metrics Dashboard - Supy-style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cost"
          value={`$${metrics.totalCost.toFixed(2)}`}
          subtitle={`For ${yieldQuantity * multiplier} ${yieldUnit}`}
          icon={DollarSign}
          variant="primary"
        />
        <MetricCard
          title="Cost/Portion"
          value={`$${metrics.costPerPortion.toFixed(2)}`}
          subtitle="Unit food cost"
          icon={UtensilsCrossed}
        />
        <MetricCard
          title="Suggested Price"
          value={`$${metrics.suggestedPrice.toFixed(2)}`}
          subtitle={`Target ${targetFoodCostPercent}% food cost`}
          icon={Target}
          variant="accent"
        />
        <MetricCard
          title="Profit Margin"
          value={`${metrics.profitMargin.toFixed(1)}%`}
          subtitle="Gross profit"
          icon={TrendingUp}
        />
      </div>

      {/* Cost Breakdown Chart */}
      {costBreakdownItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FoodCostChart 
            items={costBreakdownItems}
            title="Cost Breakdown"
          />
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ingredients</span>
                <span className="font-mono font-medium">{ingredients.length} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Scale Factor</span>
                <span className="font-mono font-medium">{multiplier}x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Food Cost %</span>
                <span className={`font-mono font-medium ${
                  metrics.suggestedPrice > 0 && (metrics.costPerPortion / metrics.suggestedPrice) * 100 <= targetFoodCostPercent 
                    ? "text-green-600" 
                    : "text-destructive"
                }`}>
                  {metrics.suggestedPrice > 0 
                    ? `${((metrics.costPerPortion / metrics.suggestedPrice) * 100).toFixed(1)}%`
                    : "--"
                  }
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Yield Input */}
      <YieldInput
        quantity={yieldQuantity}
        unit={yieldUnit}
        onQuantityChange={setYieldQuantity}
        onUnitChange={setYieldUnit}
      />
      
      {/* Scaling Control */}
      <ScalingControl
        multiplier={multiplier}
        onChange={setMultiplier}
        baseYield={yieldQuantity}
        yieldUnit={yieldUnit}
      />
      
      {/* Ingredient List with Pricing */}
      <IngredientList
        ingredients={ingredients}
        onChange={setIngredients}
        multiplier={multiplier}
      />
      
      {/* Costing Section */}
      <CostingSection
        ingredients={ingredients}
        yieldQuantity={yieldQuantity}
        multiplier={multiplier}
        laborCost={laborCost}
        overheadPercent={overheadPercent}
        targetFoodCostPercent={targetFoodCostPercent}
        onLaborCostChange={setLaborCost}
        onOverheadPercentChange={setOverheadPercent}
        onTargetFoodCostPercentChange={setTargetFoodCostPercent}
      />
    </div>
  );
}
