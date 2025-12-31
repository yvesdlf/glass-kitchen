import { GlassCard } from "@/components/ui/GlassCard";
import { Recipe } from "@/models/Recipe";
import { ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <GlassCard 
      className="p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center flex-shrink-0">
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              alt={recipe.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <ChefHat className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {recipe.description}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
