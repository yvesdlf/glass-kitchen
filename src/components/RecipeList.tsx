import { Recipe, RecipeCategory, RECIPE_CATEGORIES } from "@/models/Recipe";
import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onRecipeClick }: RecipeListProps) {
  const recipesByCategory = RECIPE_CATEGORIES.reduce((acc, category) => {
    acc[category] = recipes.filter(r => r.category === category);
    return acc;
  }, {} as Record<RecipeCategory, Recipe[]>);

  const hasRecipes = recipes.length > 0;

  if (!hasRecipes) {
    return null;
  }

  return (
    <div className="space-y-8">
      {RECIPE_CATEGORIES.map((category) => {
        const categoryRecipes = recipesByCategory[category];
        if (categoryRecipes.length === 0) return null;

        return (
          <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-semibold text-foreground mb-4 px-1">
              {category}
            </h2>
            <div className="grid gap-3">
              {categoryRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  onClick={() => onRecipeClick?.(recipe)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
