import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeList } from "@/components/RecipeList";

export default function RecipeBook() {
  const { recipes, isLoading } = useRecipes();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <GlassCard className="p-12 text-center animate-pulse">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20" />
        <div className="h-6 w-48 mx-auto bg-muted/20 rounded-lg mb-3" />
        <div className="h-4 w-64 mx-auto bg-muted/20 rounded-lg" />
      </GlassCard>
    );
  }

  if (recipes.length === 0) {
    return (
      <GlassCard className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Your recipe library is empty
        </h2>
        
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Add your first recipe to get started.
        </p>
        
        <button
          onClick={() => navigate("/upload-recipe")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Recipe
        </button>
      </GlassCard>
    );
  }

  return (
    <RecipeList 
      recipes={recipes} 
      onRecipeClick={(recipe) => {
        console.log("View recipe:", recipe.id);
      }}
    />
  );
}
