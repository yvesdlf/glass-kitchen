import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Recipe, RecipeCategory } from "@/models/Recipe";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = async () => {
    if (!user) {
      setRecipes([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setRecipes((data || []) as Recipe[]);
    } catch (error: any) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const createRecipe = async (
    title: string,
    markdownContent: string,
    category: RecipeCategory,
    description?: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to create recipes");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
          title,
          markdown_content: markdownContent,
          category,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      
      setRecipes((prev) => [data as Recipe, ...prev]);
      toast.success("Recipe saved!");
      return data as Recipe;
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to save recipe");
      return null;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Recipe deleted");
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  return {
    recipes,
    isLoading,
    createRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  };
}
