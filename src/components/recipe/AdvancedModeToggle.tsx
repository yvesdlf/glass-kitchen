import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AdvancedModeToggleProps {
  isAdvanced: boolean;
  onToggle: (value: boolean) => void;
}

export function AdvancedModeToggle({ isAdvanced, onToggle }: AdvancedModeToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-card/60 backdrop-blur-lg border border-border/40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <Label htmlFor="advanced-mode" className="text-foreground font-medium cursor-pointer">
            Advanced Mode
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable costing, pricing & scaling
          </p>
        </div>
      </div>
      <Switch
        id="advanced-mode"
        checked={isAdvanced}
        onCheckedChange={onToggle}
      />
    </div>
  );
}
