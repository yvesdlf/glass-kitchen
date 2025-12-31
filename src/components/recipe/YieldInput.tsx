import { GlassInput } from "@/components/ui/GlassInput";
import { Users } from "lucide-react";

interface YieldInputProps {
  quantity: number;
  unit: string;
  onQuantityChange: (value: number) => void;
  onUnitChange: (value: string) => void;
}

export function YieldInput({ quantity, unit, onQuantityChange, onUnitChange }: YieldInputProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <GlassInput
        type="number"
        placeholder="Yield quantity"
        value={quantity || ''}
        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
        icon={Users}
        min={1}
      />
      <div className="relative">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-card/60 backdrop-blur-lg border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
        >
          <option value="portions">Portions</option>
          <option value="servings">Servings</option>
          <option value="pieces">Pieces</option>
          <option value="kg">Kilograms</option>
          <option value="liters">Liters</option>
        </select>
      </div>
    </div>
  );
}
