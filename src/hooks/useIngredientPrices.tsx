import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IngredientPrice } from "@/models/IngredientPrice";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useIngredientPrices() {
  const { user } = useAuth();
  const [prices, setPrices] = useState<IngredientPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    if (!user) {
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

  const importFromExcel = async (htmlContent: string) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Parse HTML table to extract ingredient data
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const rows = doc.querySelectorAll('tr');
      
      const ingredients: Omit<IngredientPrice, "id" | "user_id" | "created_at" | "updated_at">[] = [];
      
      rows.forEach((row, index) => {
        // Skip header rows
        if (index < 2) return;
        
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
          const itemCode = cells[0]?.textContent?.trim();
          const categoryName = cells[1]?.textContent?.trim();
          const description = cells[2]?.textContent?.trim();
          const baseUnit = cells[3]?.textContent?.trim();
          const conditioning = parseFloat(cells[4]?.textContent?.trim() || '1000');
          const priceText = cells[6]?.textContent?.trim().replace(/[^0-9.]/g, '');
          const price = parseFloat(priceText || '0');
          
          if (itemCode && categoryName && !itemCode.includes('#N/A') && categoryName !== '0') {
            ingredients.push({
              item_code: itemCode,
              category_name: categoryName,
              description: description || undefined,
              base_unit: baseUnit || 'G',
              conditioning: isNaN(conditioning) ? 1000 : conditioning,
              price_per_unit: isNaN(price) ? 0 : price,
            });
          }
        }
      });

      if (ingredients.length === 0) {
        toast.error("No valid ingredients found in file");
        return;
      }

      // Insert all ingredients
      const { data, error } = await supabase
        .from("ingredient_prices")
        .upsert(
          ingredients.map(ing => ({ ...ing, user_id: user.id })),
          { onConflict: 'user_id,item_code' }
        )
        .select();

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

  return {
    prices,
    isLoading,
    addPrice,
    updatePrice,
    deletePrice,
    importFromExcel,
    refetch: fetchPrices,
  };
}
