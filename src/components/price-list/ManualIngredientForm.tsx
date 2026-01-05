import { useState } from "react";
import { Plus, Calculator } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManualIngredientFormProps {
  onAdd: (ingredient: {
    item_code: string;
    category_name: string;
    description?: string;
    base_unit: string;
    conditioning: number;
    price_per_unit: number;
    initial_weight: number;
    waste_weight: number;
    yield_weight: number;
    wastage_percent: number;
    true_cost: number;
  }) => Promise<any>;
  nextCode: string;
}

const CATEGORIES = [
  "Proteins",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Dry Goods",
  "Spices",
  "Oils & Fats",
  "Beverages",
  "Other",
];

const UNITS = ["G", "KG", "ML", "L", "EA", "OZ", "LB"];

export function ManualIngredientForm({ onAdd, nextCode }: ManualIngredientFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    category_name: "Proteins",
    description: "",
    base_unit: "G",
    conditioning: 1000,
    price_per_unit: 0,
    initial_weight: 0,
    waste_weight: 0,
  });

  // Calculate derived values
  const yieldWeight = Math.max(form.initial_weight - form.waste_weight, 0);
  const wastagePercent = form.initial_weight > 0 
    ? (form.waste_weight / form.initial_weight) * 100 
    : 0;
  const yieldFactor = 1 - wastagePercent / 100;
  const trueCost = yieldFactor > 0 
    ? form.price_per_unit / yieldFactor 
    : form.price_per_unit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    setIsLoading(true);
    const result = await onAdd({
      item_code: nextCode,
      category_name: form.category_name,
      description: form.description.trim(),
      base_unit: form.base_unit,
      conditioning: form.conditioning,
      price_per_unit: form.price_per_unit,
      initial_weight: form.initial_weight,
      waste_weight: form.waste_weight,
      yield_weight: yieldWeight,
      wastage_percent: wastagePercent,
      true_cost: trueCost,
    });

    if (result) {
      setForm({
        category_name: "Proteins",
        description: "",
        base_unit: "G",
        conditioning: 1000,
        price_per_unit: 0,
        initial_weight: 0,
        waste_weight: 0,
      });
      setIsOpen(false);
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        Add Ingredient Manually
      </button>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Add New Ingredient</h3>
            <p className="text-sm text-muted-foreground">
              Code: <span className="font-mono text-primary">{nextCode}</span> (auto-assigned)
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category_name}
              onValueChange={(v) => setForm({ ...form, category_name: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label>Description *</Label>
            <GlassInput
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Fresh Salmon Fillet"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price per Unit ($)</Label>
            <GlassInput
              type="number"
              step="0.01"
              min="0"
              value={form.price_per_unit || ""}
              onChange={(e) => setForm({ ...form, price_per_unit: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          {/* Base Unit */}
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={form.base_unit}
              onValueChange={(v) => setForm({ ...form, base_unit: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditioning */}
          <div className="space-y-2">
            <Label>Conditioning (per)</Label>
            <GlassInput
              type="number"
              min="1"
              value={form.conditioning || ""}
              onChange={(e) => setForm({ ...form, conditioning: parseInt(e.target.value) || 1000 })}
              placeholder="1000"
            />
          </div>
        </div>

        {/* Wastage Calculator Section */}
        <div className="border-t border-border/50 pt-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Wastage Calculator</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Initial Weight</Label>
              <GlassInput
                type="number"
                step="0.01"
                min="0"
                value={form.initial_weight || ""}
                onChange={(e) => setForm({ ...form, initial_weight: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Waste Weight</Label>
              <GlassInput
                type="number"
                step="0.01"
                min="0"
                value={form.waste_weight || ""}
                onChange={(e) => setForm({ ...form, waste_weight: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Yield Weight</Label>
              <div className="h-10 px-3 rounded-lg bg-muted/30 flex items-center font-mono text-sm">
                {yieldWeight.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Wastage %</Label>
              <div className="h-10 px-3 rounded-lg bg-muted/30 flex items-center font-mono text-sm">
                {wastagePercent.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Calculated True Cost */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10">
          <span className="font-medium text-foreground">Calculated True Cost:</span>
          <span className="text-xl font-bold text-primary">${trueCost.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <PrimaryButton type="submit" isLoading={isLoading} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
