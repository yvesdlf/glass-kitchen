import { useState, useMemo } from "react";
import { List, Package, DollarSign, TrendingUp, Scale } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useIngredientPrices } from "@/hooks/useIngredientPrices";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WastageIndicator } from "@/components/dashboard/WastageIndicator";
import { FoodCostChart } from "@/components/dashboard/FoodCostChart";
import { ManualIngredientForm } from "@/components/price-list/ManualIngredientForm";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function PriceList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { prices, isLoading, addPrice, getNextCode } = useIngredientPrices();

  // Filter prices based on search
  const filteredPrices = useMemo(() => {
    if (!searchQuery.trim()) return prices;
    const query = searchQuery.toLowerCase();
    return prices.filter(
      (p) =>
        p.item_code.toLowerCase().includes(query) ||
        p.category_name.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query) ?? false)
    );
  }, [prices, searchQuery]);

  // Calculate dashboard metrics
  const totalItems = prices.length;
  const avgPrice = prices.length > 0 
    ? prices.reduce((sum, p) => sum + p.price_per_unit, 0) / prices.length 
    : 0;
  const avgWastage = prices.length > 0 
    ? prices.filter(p => p.wastage_percent != null).reduce((sum, p) => sum + (p.wastage_percent || 0), 0) / 
      prices.filter(p => p.wastage_percent != null).length || 0
    : 0;
  const itemsWithTrueCost = prices.filter(p => p.true_cost != null).length;

  // Group by category for chart
  const categories = prices.reduce((acc, p) => {
    acc[p.category_name] = (acc[p.category_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: ("primary" | "accent" | "muted" | "secondary")[] = ["primary", "accent", "secondary", "muted"];
  const chartItems = Object.entries(categories)
    .slice(0, 4)
    .map(([label, value], index) => ({
      label,
      value,
      total: totalItems,
      color: categoryColors[index % categoryColors.length],
    }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i} className="p-5 animate-pulse">
              <div className="h-4 w-20 bg-muted/30 rounded mb-2" />
              <div className="h-8 w-16 bg-muted/30 rounded" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  const nextCode = getNextCode();

  if (prices.length === 0) {
    return (
      <div className="space-y-6">
        <ManualIngredientForm onAdd={addPrice} nextCode={nextCode} />
        <GlassCard className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20 flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            No ingredients in price list
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Add ingredients manually above or upload a price list file.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics - Supy-style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Items"
          value={totalItems}
          subtitle="In price list"
          icon={Package}
          variant="primary"
        />
        <MetricCard
          title="Avg. Price/Unit"
          value={`$${avgPrice.toFixed(2)}`}
          subtitle="Across all items"
          icon={DollarSign}
        />
        <MetricCard
          title="True Cost Items"
          value={itemsWithTrueCost}
          subtitle={`${((itemsWithTrueCost / totalItems) * 100).toFixed(0)}% calculated`}
          icon={TrendingUp}
          variant="accent"
        />
        <MetricCard
          title="Categories"
          value={Object.keys(categories).length}
          subtitle="Product groups"
          icon={List}
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WastageIndicator 
          percentage={avgWastage} 
          label="Average Wastage Rate"
          threshold={5}
        />
        <FoodCostChart 
          items={chartItems}
          title="Items by Category"
        />
      </div>

      {/* Manual Entry Form */}
      <ManualIngredientForm onAdd={addPrice} nextCode={nextCode} />

      {/* Search and Table Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Ingredient Price List</h2>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `${filteredPrices.length} of ${prices.length}` : prices.length} ingredients
              </p>
            </div>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by code, category, or description..."
            className="w-full md:w-80"
          />
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">Initial Wt</TableHead>
                <TableHead className="font-semibold text-right">Waste Wt</TableHead>
                <TableHead className="font-semibold text-right">Yield Wt</TableHead>
                <TableHead className="font-semibold text-right">Wastage</TableHead>
                <TableHead className="font-semibold text-right">Price/Unit</TableHead>
                <TableHead className="font-semibold text-right">True Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.map((price) => {
                const wastageLevel = (price.wastage_percent || 0) > 10 ? "high" : 
                                     (price.wastage_percent || 0) > 5 ? "medium" : "low";
                return (
                  <TableRow key={price.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-sm">{price.item_code}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {price.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{price.description || "-"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {price.initial_weight?.toFixed(2) || "-"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {price.waste_weight?.toFixed(2) || "-"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {price.yield_weight?.toFixed(2) || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {price.wastage_percent != null ? (
                        <Badge 
                          variant={wastageLevel === "high" ? "destructive" : "secondary"}
                          className={wastageLevel === "low" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                          {price.wastage_percent.toFixed(1)}%
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ${price.price_per_unit.toFixed(2)}/{price.base_unit}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary tabular-nums">
                      {price.true_cost != null ? `$${price.true_cost.toFixed(2)}` : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </GlassCard>
    </div>
  );
}
