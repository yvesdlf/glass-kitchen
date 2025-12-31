import { useState, useCallback, DragEvent } from "react";
import { Upload, FileSpreadsheet, X, List } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useIngredientPrices } from "@/hooks/useIngredientPrices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function PriceListUpload() {
  const { prices, importFromExcel, isLoading } = useIngredientPrices();
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".htm") || file.name.endsWith(".html") || file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          await importFromExcel(text);
          setIsImporting(false);
        };
        reader.readAsText(file);
      }
    }
  }, [importFromExcel]);

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Price List</h3>
        </div>
        {prices.length > 0 && (
          <Dialog open={showPriceList} onOpenChange={setShowPriceList}>
            <DialogTrigger asChild>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <List className="h-3 w-3" />
                View ({prices.length})
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>Ingredient Price List</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground p-2 bg-muted/10 rounded-lg">
                  <span>Code</span>
                  <span>Category</span>
                  <span>Description</span>
                  <span>Unit</span>
                  <span className="text-right">Price</span>
                </div>
                {prices.map((price) => (
                  <div key={price.id} className="grid grid-cols-5 gap-2 text-sm p-2 rounded-lg hover:bg-muted/10">
                    <span className="text-primary font-mono">{price.item_code}</span>
                    <span className="text-foreground">{price.category_name}</span>
                    <span className="text-muted-foreground truncate">{price.description || '-'}</span>
                    <span className="text-muted-foreground">{price.base_unit}</span>
                    <span className="text-right text-foreground">${price.price_per_unit.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div
        className={`p-4 rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/40 hover:border-border/60"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm text-foreground mb-1">
            {isImporting ? "Importing..." : "Drop Excel file here"}
          </p>
          <p className="text-xs text-muted-foreground">
            .htm, .html, .xls, .xlsx
          </p>
        </div>
      </div>

      {prices.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {prices.length} ingredients loaded
        </p>
      )}
    </GlassCard>
  );
}
