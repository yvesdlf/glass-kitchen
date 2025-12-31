import { Minus, Plus, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface ScalingControlProps {
  multiplier: number;
  onChange: (value: number) => void;
  baseYield: number;
  yieldUnit: string;
}

export function ScalingControl({ multiplier, onChange, baseYield, yieldUnit }: ScalingControlProps) {
  const presets = [0.5, 1, 2, 3, 4, 5];
  
  const scaledYield = baseYield * multiplier;

  const handleDecrement = () => {
    if (multiplier > 0.25) {
      onChange(Math.round((multiplier - 0.25) * 100) / 100);
    }
  };

  const handleIncrement = () => {
    if (multiplier < 10) {
      onChange(Math.round((multiplier + 0.25) * 100) / 100);
    }
  };

  return (
    <GlassCard className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recipe Scaling</h3>
        <button
          onClick={() => onChange(1)}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Multiplier control */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={multiplier <= 0.25}
          className="w-10 h-10 rounded-xl bg-card/60 border border-border/40 flex items-center justify-center text-foreground hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <div className="text-center min-w-[100px]">
          <div className="text-3xl font-bold text-primary">×{multiplier}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {scaledYield} {yieldUnit}
          </div>
        </div>
        
        <button
          onClick={handleIncrement}
          disabled={multiplier >= 10}
          className="w-10 h-10 rounded-xl bg-card/60 border border-border/40 flex items-center justify-center text-foreground hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2 justify-center flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
              multiplier === preset
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/40 text-muted-foreground hover:bg-card/60'
            }`}
          >
            ×{preset}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
