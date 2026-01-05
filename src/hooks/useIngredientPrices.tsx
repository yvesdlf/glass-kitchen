import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { IngredientPrice } from "@/models/IngredientPrice";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useIngredientPrices() {
  const { user, session } = useAuth();
  const [prices, setPrices] = useState<IngredientPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ensureSession = async () => {
    if (!session) return false;

    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      toast.error("Session expired. Please sign in again.");
      return false;
    }

    return true;
  };

  const readFileAsText = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });

  const readFileAsArrayBuffer = (file: File) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });

  const toNumber = (value: unknown) => {
    const s = String(value ?? "").trim();
    const clean = s.replace(/[^0-9.-]/g, "");
    const n = parseFloat(clean);
    return Number.isFinite(n) ? n : 0;
  };

  const computeWastagePercent = (initialWeight: number, wasteWeight: number) => {
    if (initialWeight <= 0) return 0;
    return (wasteWeight / initialWeight) * 100;
  };

  const computeTrueCost = (unitCost: number, wastagePercent: number) => {
    const yieldFactor = 1 - wastagePercent / 100;
    if (yieldFactor <= 0) return unitCost;
    return unitCost / yieldFactor;
  };

  const fetchPrices = async () => {
    if (!user) {
      setPrices([]);
      setIsLoading(false);
      return;
    }

    if (!(await ensureSession())) {
      setPrices([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ingredient_prices")
        .select("*")
        .eq("user_id", user.id)
        .order("category_name", { ascending: true });

      if (error) throw error;
      
      // Cast the data properly
      const typedData = (data || []).map(item => ({
        ...item,
        conditioning: Number(item.conditioning),
        price_per_unit: Number(item.price_per_unit),
        initial_weight: Number(item.initial_weight || 0),
        waste_weight: Number(item.waste_weight || 0),
        yield_weight: Number(item.yield_weight || 0),
        wastage_percent: Number(item.wastage_percent || 0),
        true_cost: Number(item.true_cost || 0),
      })) as IngredientPrice[];
      
      setPrices(typedData);
    } catch (error: any) {
      console.error("Error fetching ingredient prices:", error);
      toast.error("Failed to load price list");
    } finally {
      setIsLoading(false);
    }
  };

  const addPrice = async (price: Omit<IngredientPrice, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast.error("You must be logged in");
      return null;
    }

    if (!(await ensureSession())) return null;

    try {
      const { data, error } = await supabase
        .from("ingredient_prices")
        .insert({
          ...price,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        conditioning: Number(data.conditioning),
        price_per_unit: Number(data.price_per_unit),
        initial_weight: Number(data.initial_weight || 0),
        waste_weight: Number(data.waste_weight || 0),
        yield_weight: Number(data.yield_weight || 0),
        wastage_percent: Number(data.wastage_percent || 0),
        true_cost: Number(data.true_cost || 0),
      } as IngredientPrice;
      
      setPrices((prev) => [...prev, typedData]);
      toast.success("Ingredient price added");
      return typedData;
    } catch (error: any) {
      console.error("Error adding price:", error);
      if (error.code === '23505') {
        toast.error("Item code already exists");
      } else {
        toast.error("Failed to add price");
      }
      return null;
    }
  };

  const updatePrice = async (id: string, updates: Partial<IngredientPrice>) => {
    if (!(await ensureSession())) return null;

    try {
      const { data, error } = await supabase
        .from("ingredient_prices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        conditioning: Number(data.conditioning),
        price_per_unit: Number(data.price_per_unit),
        initial_weight: Number(data.initial_weight || 0),
        waste_weight: Number(data.waste_weight || 0),
        yield_weight: Number(data.yield_weight || 0),
        wastage_percent: Number(data.wastage_percent || 0),
        true_cost: Number(data.true_cost || 0),
      } as IngredientPrice;
      
      setPrices((prev) => prev.map((p) => (p.id === id ? typedData : p)));
      toast.success("Price updated");
      return typedData;
    } catch (error: any) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
      return null;
    }
  };

  const deletePrice = async (id: string) => {
    if (!(await ensureSession())) return;

    try {
      const { error } = await supabase
        .from("ingredient_prices")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setPrices((prev) => prev.filter((p) => p.id !== id));
      toast.success("Price deleted");
    } catch (error: any) {
      console.error("Error deleting price:", error);
      toast.error("Failed to delete price");
    }
  };

  const importFromFile = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (!(await ensureSession())) {
      return;
    }

    try {
      const ingredients: Omit<
        IngredientPrice,
        "id" | "user_id" | "created_at" | "updated_at"
      >[] = [];

      const isHtml =
        file.name.endsWith(".htm") || file.name.endsWith(".html");
      const isXlsx =
        file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

      if (isHtml) {
        const htmlContent = await readFileAsText(file);
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const rows = doc.querySelectorAll("tr");

        rows.forEach((row, index) => {
          if (index < 1) return;

          const cells = row.querySelectorAll("td");
          if (cells.length < 6) return;

          const itemCode = cells[0]?.textContent?.trim();
          const categoryName = cells[1]?.textContent?.trim();
          const description = cells[2]?.textContent?.trim();
          const unitCost = toNumber(cells[3]?.textContent);
          const baseUnit = cells[4]?.textContent?.trim() || "G";
          const conditioning = toNumber(cells[5]?.textContent) || 1000;
          const initialWeight = toNumber(cells[6]?.textContent);
          const wasteWeight = toNumber(cells[7]?.textContent);
          const fileYield = toNumber(cells[8]?.textContent);
          const fileWastage = toNumber(cells[9]?.textContent);
          const fileTrueCost = toNumber(cells[10]?.textContent);

          if (
            itemCode &&
            categoryName &&
            !itemCode.includes("#DIV") &&
            !itemCode.includes("#N/A") &&
            categoryName !== "0"
          ) {
            const yieldWeight = fileYield || Math.max(initialWeight - wasteWeight, 0);
            const wastagePercent =
              fileWastage || computeWastagePercent(initialWeight, wasteWeight);
            const trueCost =
              fileTrueCost || computeTrueCost(unitCost, wastagePercent);

            ingredients.push({
              item_code: itemCode,
              category_name: categoryName,
              description: description || undefined,
              base_unit: baseUnit,
              conditioning,
              price_per_unit: unitCost,
              initial_weight: initialWeight,
              waste_weight: wasteWeight,
              yield_weight: yieldWeight,
              wastage_percent: wastagePercent,
              true_cost: trueCost,
            });
          }
        });
      } else if (isXlsx) {
        const buffer = await readFileAsArrayBuffer(file);
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        }) as unknown[][];

        const headerIndex = rows.findIndex((r) =>
          String(r?.[0] ?? "")
            .toLowerCase()
            .includes("item")
        );
        const startIndex = Math.max(headerIndex, 0) + 1;

        for (let i = startIndex; i < rows.length; i++) {
          const r = rows[i] as unknown[];
          if (!r || r.length < 4) continue;

          const itemCode = String(r[0] ?? "").trim();
          const categoryName = String(r[1] ?? "").trim();
          const description = String(r[2] ?? "").trim();
          const unitCost = toNumber(r[3]);
          const baseUnit = String(r[4] ?? "G").trim() || "G";
          const conditioning = toNumber(r[5]) || 1000;
          const initialWeight = toNumber(r[6]);
          const wasteWeight = toNumber(r[7]);
          const fileYield = toNumber(r[8]);
          const fileWastage = toNumber(r[9]);
          const fileTrueCost = toNumber(r[10]);

          if (!itemCode || !categoryName) continue;
          if (itemCode.includes("#DIV") || itemCode.includes("#N/A")) continue;
          if (categoryName === "0") continue;

          const yieldWeight = fileYield || Math.max(initialWeight - wasteWeight, 0);
          const wastagePercent =
            fileWastage || computeWastagePercent(initialWeight, wasteWeight);
          const trueCost = fileTrueCost || computeTrueCost(unitCost, wastagePercent);

          ingredients.push({
            item_code: itemCode,
            category_name: categoryName,
            description: description || undefined,
            base_unit: baseUnit,
            conditioning,
            price_per_unit: unitCost,
            initial_weight: initialWeight,
            waste_weight: wasteWeight,
            yield_weight: yieldWeight,
            wastage_percent: wastagePercent,
            true_cost: trueCost,
          });
        }
      } else {
        toast.error("Unsupported file type");
        return;
      }

      if (ingredients.length === 0) {
        toast.error("No valid ingredients found in file");
        return;
      }

      const { error } = await supabase
        .from("ingredient_prices")
        .upsert(ingredients.map((ing) => ({ ...ing, user_id: user.id })), {
          onConflict: "user_id,item_code",
        });

      if (error) throw error;

      await fetchPrices();
      toast.success(`Imported ${ingredients.length} ingredients`);
    } catch (error: any) {
      console.error("Error importing:", error);
      toast.error("Failed to import price list");
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [user]);

  // Generate next sequential code
  const getNextCode = () => {
    const existingCodes = prices
      .map((p) => p.item_code)
      .filter((code) => /^ING-\d+$/.test(code))
      .map((code) => parseInt(code.replace("ING-", ""), 10));
    
    const maxCode = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    return `ING-${String(maxCode + 1).padStart(4, "0")}`;
  };

  return {
    prices,
    isLoading,
    addPrice,
    updatePrice,
    deletePrice,
    importFromFile,
    refetch: fetchPrices,
    getNextCode,
  };
}
