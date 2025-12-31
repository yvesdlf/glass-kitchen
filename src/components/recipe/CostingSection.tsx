import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RecipeIngredient, RecipeCosting } from "@/models/IngredientPrice";

interface CostingSectionProps {
  ingredients: RecipeIngredient[];
  yieldQuantity: number;
  multiplier: number;
  laborCost: number;
  overheadPercent: number;
  targetFoodCostPercent: number;
  onLaborCostChange: (value: number) => void;
  onOverheadPercentChange: (value: number) => void;
  onTargetFoodCostPercentChange: (value: number) => void;
}

export function CostingSection({
  ingredients,
  yieldQuantity,
  multiplier,
  laborCost,
  overheadPercent,
  targetFoodCostPercent,
  onLaborCostChange,
  onOverheadPercentChange,
  onTargetFoodCostPercentChange,
}: CostingSectionProps) {
  // Calculate costs
  const ingredientCost = ingredients.reduce((sum, ing) => sum + (ing.total_cost || 0), 0) * multiplier;
  const scaledLaborCost = laborCost * multiplier;
  const subtotal = ingredientCost + scaledLaborCost;
  const overheadCost = subtotal * (overheadPercent / 100);
  const totalCost = subtotal + overheadCost;
  const scaledYield = yieldQuantity * multiplier;
  const costPerPortion = scaledYield > 0 ? totalCost / scaledYield : 0;
  
  // Calculate suggested price based on target food cost %
  const suggestedPrice = targetFoodCostPercent > 0 
    ? costPerPortion / (targetFoodCostPercent / 100) 
    : 0;
  
  // Actual food cost % if sold at suggested price
  const actualFoodCostPercent = suggestedPrice > 0 
    ? (costPerPortion / suggestedPrice) * 100 
    : 0;

  return (
    <GlassCard className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recipe Costing</h3>
      </div>

      {/* Cost inputs */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Labor Cost ($)</label>
          <input
            type="number"
            value={laborCost || ''}
            onChange={(e) => onLaborCostChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Overhead (%)</label>
          <input
            type="number"
            value={overheadPercent || ''}
            onChange={(e) => onOverheadPercentChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
            placeholder="0"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Target Food Cost (%)</label>
          <input
            type="number"
            value={targetFoodCostPercent || ''}
            onChange={(e) => onTargetFoodCostPercentChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
            placeholder="30"
            min="1"
            max="100"
          />
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="space-y-2 pt-3 border-t border-border/20">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ingredient Cost:</span>
          <span className="text-foreground">${ingredientCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Labor Cost:</span>
          <span className="text-foreground">${scaledLaborCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Overhead ({overheadPercent}%):</span>
          <span className="text-foreground">${overheadCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2 border-t border-border/20">
          <span className="text-foreground">Total Cost:</span>
          <span className="text-primary">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Per portion summary */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
        <div className="p-3 rounded-xl bg-muted/10 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
            <DollarSign className="h-3 w-3" />
            Cost per Portion
          </div>
          <div className="text-xl font-bold text-foreground">${costPerPortion.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">for {scaledYield} portions</div>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3 w-3" />
            Suggested Price
          </div>
          <div className="text-xl font-bold text-primary">${suggestedPrice.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">at {targetFoodCostPercent}% food cost</div>
        </div>
      </div>

      {/* Profit indicator */}
      {suggestedPrice > 0 && (
        <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-green-500/10">
          <Percent className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">
            Gross Profit Margin: {(100 - actualFoodCostPercent).toFixed(1)}%
          </span>
        </div>
      )}
    </GlassCard>
  );
}
