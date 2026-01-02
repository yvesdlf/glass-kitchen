import { useState } from "react";
import { RecipeIngredient } from "@/models/IngredientPrice";
import { IngredientList } from "@/components/recipe/IngredientList";
import { ScalingControl } from "@/components/recipe/ScalingControl";
import { CostingSection } from "@/components/recipe/CostingSection";
import { YieldInput } from "@/components/recipe/YieldInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calculator } from "lucide-react";

export default function AdvancedCosting() {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [laborCost, setLaborCost] = useState(0);
  const [overheadPercent, setOverheadPercent] = useState(0);
  const [targetFoodCostPercent, setTargetFoodCostPercent] = useState(30);
  const [yieldQuantity, setYieldQuantity] = useState(1);
  const [yieldUnit, setYieldUnit] = useState("portions");

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Advanced Recipe Costing</h2>
            <p className="text-sm text-muted-foreground">Calculate costs, scale recipes, and set pricing</p>
          </div>
        </div>
      </GlassCard>

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
