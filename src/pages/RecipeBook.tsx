import { BookOpen, Plus, TrendingUp, Clock, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeList } from "@/components/RecipeList";
import { MetricCard } from "@/components/dashboard/MetricCard";

export default function RecipeBook() {
  const { recipes, isLoading } = useRecipes();
  const navigate = useNavigate();

  // Calculate metrics
  const totalRecipes = recipes.length;
  const advancedRecipes = recipes.filter(r => r.is_advanced).length;
  const categories = [...new Set(recipes.map(r => r.category))].length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="p-5 animate-pulse">
              <div className="h-4 w-20 bg-muted/30 rounded mb-2" />
              <div className="h-8 w-16 bg-muted/30 rounded" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <GlassCard className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Your recipe library is empty
        </h2>
        
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Start building your recipe collection with accurate costing.
        </p>
        
        <button
          onClick={() => navigate("/upload-recipe")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Your First Recipe
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Recipes"
          value={totalRecipes}
          subtitle="In your library"
          icon={BookOpen}
          variant="primary"
        />
        <MetricCard
          title="With Costing"
          value={advancedRecipes}
          subtitle={`${totalRecipes > 0 ? ((advancedRecipes / totalRecipes) * 100).toFixed(0) : 0}% have pricing`}
          icon={TrendingUp}
          variant="accent"
        />
        <MetricCard
          title="Categories"
          value={categories}
          subtitle="Recipe groups"
          icon={Clock}
        />
      </div>

      {/* Recipe List */}
      <RecipeList 
        recipes={recipes} 
        onRecipeClick={(recipe) => {
          console.log("View recipe:", recipe.id);
        }}
      />
    </div>
  );
}
