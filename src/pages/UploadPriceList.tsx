import { FileSpreadsheet } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PriceListUpload } from "@/components/recipe/PriceListUpload";

export default function UploadPriceList() {
  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upload Price List</h2>
            <p className="text-sm text-muted-foreground">Import your ingredient prices from Excel or HTML</p>
          </div>
        </div>
      </GlassCard>

      <PriceListUpload />
    </div>
  );
}
