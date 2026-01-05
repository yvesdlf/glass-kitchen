import { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RecipeIngredient } from "@/models/IngredientPrice";

interface IngredientListProps {
  ingredients: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
  multiplier: number;
}

export function IngredientList({ ingredients, onChange, multiplier }: IngredientListProps) {
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    name: '',
    quantity: 0,
    unit: 'g',
    price_per_unit: 0,
    conditioning: 1000,
  });

  const calculateCost = useCallback((quantity: number, pricePerUnit: number, conditioning: number) => {
    if (!pricePerUnit || !conditioning || conditioning <= 0) return 0;
    if (quantity <= 0) return 0;
    return (quantity / conditioning) * pricePerUnit;
  }, []);

  const addIngredient = useCallback(() => {
    if (!newIngredient.name || !newIngredient.quantity || newIngredient.quantity <= 0) return;
    
    const ingredient: RecipeIngredient = {
      id: crypto.randomUUID(),
      name: newIngredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit || 'g',
      price_per_unit: newIngredient.price_per_unit || 0,
      conditioning: newIngredient.conditioning || 1000,
      total_cost: calculateCost(newIngredient.quantity, newIngredient.price_per_unit || 0, newIngredient.conditioning || 1000),
    };
    
    onChange([...ingredients, ingredient]);
    setNewIngredient({ name: '', quantity: 0, unit: 'g', price_per_unit: 0, conditioning: 1000 });
  }, [newIngredient, ingredients, onChange, calculateCost]);

  const removeIngredient = useCallback((id: string) => {
    onChange(ingredients.filter(ing => ing.id !== id));
  }, [ingredients, onChange]);

  const updateIngredient = useCallback((id: string, updates: Partial<RecipeIngredient>) => {
    onChange(ingredients.map(ing => {
      if (ing.id === id) {
        const updated = { ...ing, ...updates };
        updated.total_cost = calculateCost(updated.quantity, updated.price_per_unit || 0, updated.conditioning || 1000);
        return updated;
      }
      return ing;
    }));
  }, [ingredients, onChange, calculateCost]);

  const getScaledQuantity = useCallback((quantity: number) => {
    return (quantity * multiplier).toFixed(1);
  }, [multiplier]);

  const totalCost = useMemo(() => {
    return ingredients.reduce((sum, ing) => sum + (ing.total_cost || 0), 0) * multiplier;
  }, [ingredients, multiplier]);

  return (
    <GlassCard className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Ingredients & Pricing
        </h3>
        {multiplier !== 1 && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            ×{multiplier}
          </span>
        )}
      </div>

      {/* Existing ingredients */}
      <div className="space-y-2">
        {ingredients.map((ing) => (
          <div key={ing.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-muted/10">
            <div className="col-span-4">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                className="w-full px-2 py-1 text-sm bg-transparent border-b border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
                placeholder="Name"
              />
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <input
                type="number"
                value={ing.quantity}
                onChange={(e) => updateIngredient(ing.id, { quantity: parseFloat(e.target.value) || 0 })}
                className="w-full px-1 py-1 text-sm bg-transparent border-b border-border/30 focus:border-primary/50 focus:outline-none text-foreground text-center"
                placeholder="Qty"
              />
              {multiplier !== 1 && (
                <span className="text-xs text-muted-foreground">→{getScaledQuantity(ing.quantity)}</span>
              )}
            </div>
            <div className="col-span-1">
              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(ing.id, { unit: e.target.value })}
                className="w-full py-1 text-xs bg-transparent border-b border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="each">each</option>
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={ing.price_per_unit || ''}
                onChange={(e) => updateIngredient(ing.id, { price_per_unit: parseFloat(e.target.value) || 0 })}
                className="w-full px-1 py-1 text-sm bg-transparent border-b border-border/30 focus:border-primary/50 focus:outline-none text-foreground text-right"
                placeholder="Price"
                step="0.01"
              />
            </div>
            <div className="col-span-2 text-right text-sm font-medium text-primary">
              ${((ing.total_cost || 0) * multiplier).toFixed(2)}
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => removeIngredient(ing.id)}
                className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new ingredient */}
      <div className="grid grid-cols-12 gap-2 items-end pt-2 border-t border-border/20">
        <div className="col-span-4">
          <input
            type="text"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-2 py-2 text-sm rounded-lg bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
            placeholder="Ingredient name"
          />
        </div>
        <div className="col-span-2">
          <input
            type="number"
            value={newIngredient.quantity || ''}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
            className="w-full px-2 py-2 text-sm rounded-lg bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground text-center"
            placeholder="Qty"
          />
        </div>
        <div className="col-span-1">
          <select
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
            className="w-full py-2 text-xs rounded-lg bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground"
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="each">each</option>
          </select>
        </div>
        <div className="col-span-2">
          <input
            type="number"
            value={newIngredient.price_per_unit || ''}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, price_per_unit: parseFloat(e.target.value) || 0 }))}
            className="w-full px-2 py-2 text-sm rounded-lg bg-card/40 border border-border/30 focus:border-primary/50 focus:outline-none text-foreground text-right"
            placeholder="Price"
            step="0.01"
          />
        </div>
        <div className="col-span-3 flex justify-end">
          <button
            onClick={addIngredient}
            disabled={!newIngredient.name || !newIngredient.quantity}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* Total */}
      {ingredients.length > 0 && (
        <div className="flex justify-between items-center pt-3 border-t border-border/20">
          <span className="font-medium text-muted-foreground">Total Ingredient Cost:</span>
          <span className="text-lg font-bold text-primary">${totalCost.toFixed(2)}</span>
        </div>
      )}
    </GlassCard>
  );
}
