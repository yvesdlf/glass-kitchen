import { List, Package } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useIngredientPrices } from "@/hooks/useIngredientPrices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PriceList() {
  const { prices, isLoading } = useIngredientPrices();

  if (isLoading) {
    return (
      <GlassCard className="p-12 text-center animate-pulse">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20" />
        <div className="h-6 w-48 mx-auto bg-muted/20 rounded-lg mb-3" />
        <div className="h-4 w-64 mx-auto bg-muted/20 rounded-lg" />
      </GlassCard>
    );
  }

  if (prices.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20 flex items-center justify-center">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          No ingredients in price list
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Upload a price list to see your ingredients here.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <List className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ingredient Price List</h2>
            <p className="text-sm text-muted-foreground">{prices.length} ingredients loaded</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">Initial Wt</TableHead>
                <TableHead className="font-semibold text-right">Waste Wt</TableHead>
                <TableHead className="font-semibold text-right">Yield Wt</TableHead>
                <TableHead className="font-semibold text-right">Wastage %</TableHead>
                <TableHead className="font-semibold text-right">Price/Unit</TableHead>
                <TableHead className="font-semibold text-right">True Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price) => (
                <TableRow key={price.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-sm">{price.item_code}</TableCell>
                  <TableCell>{price.category_name}</TableCell>
                  <TableCell>{price.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    {price.initial_weight?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {price.waste_weight?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {price.yield_weight?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {price.wastage_percent != null ? `${price.wastage_percent.toFixed(1)}%` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${price.price_per_unit.toFixed(2)}/{price.base_unit}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {price.true_cost != null ? `$${price.true_cost.toFixed(2)}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </GlassCard>
    </div>
  );
}
