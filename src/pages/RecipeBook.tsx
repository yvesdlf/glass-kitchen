import { useState, useMemo } from "react";
import { BookOpen, Plus, TrendingUp, Clock, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeList } from "@/components/RecipeList";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SearchBar } from "@/components/ui/SearchBar";

export default function RecipeBook() {
  const [searchQuery, setSearchQuery] = useState("");
  const { recipes, isLoading } = useRecipes();
  const navigate = useNavigate();

  // Filter recipes based on search
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const query = searchQuery.toLowerCase();
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        (r.description?.toLowerCase().includes(query) ?? false)
    );
  }, [recipes, searchQuery]);

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

  // Calculate metrics
  const totalRecipes = recipes.length;
  const advancedRecipes = recipes.filter(r => r.is_advanced).length;
  const categoriesCount = [...new Set(recipes.map(r => r.category))].length;

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
          value={categoriesCount}
          subtitle="Recipe groups"
          icon={Clock}
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search recipes by name, category, or description..."
        className="max-w-md"
      />

      {/* Recipe List */}
      {filteredRecipes.length === 0 && searchQuery ? (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">No recipes match "{searchQuery}"</p>
        </GlassCard>
      ) : (
        <RecipeList 
          recipes={filteredRecipes} 
          onRecipeClick={(recipe) => {
            console.log("View recipe:", recipe.id);
          }}
        />
      )}
    </div>
  );
}
