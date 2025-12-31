import { Recipe, RecipeCategory } from "@/models/Recipe";

// Recipe service for CRUD operations
export interface RecipeServiceInterface {
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  createRecipe(recipe: Omit<Recipe, "id" | "created_at" | "updated_at">): Promise<Recipe>;
  updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe | null>;
  deleteRecipe(id: string): Promise<void>;
}

// Helper to extract metadata from markdown
export function parseRecipeMarkdown(markdown: string): { 
  title: string; 
  description: string;
  category: RecipeCategory;
} {
  const lines = markdown.split('\n');
  let title = 'Untitled Recipe';
  let description = '';
  let category: RecipeCategory = 'Mains';

  // Extract title from first # heading
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      break;
    }
  }

  // Extract description from italic line after title
  for (const line of lines) {
    if (line.startsWith('*') && line.endsWith('*') && line.length > 2) {
      description = line.slice(1, -1).trim();
      break;
    }
  }

  // Extract category from Course field
  const courseMatch = markdown.match(/\*\*Course:\*\*\s*([^\n]+)/i);
  if (courseMatch) {
    const courseValue = courseMatch[1].trim().toLowerCase();
    if (courseValue.includes('appetizer') || courseValue.includes('starter')) {
      category = 'Appetiser';
    } else if (courseValue.includes('crudo') || courseValue.includes('raw')) {
      category = 'Crudo';
    } else if (courseValue.includes('salad')) {
      category = 'Salads';
    } else if (courseValue.includes('main') || courseValue.includes('entrée')) {
      category = 'Mains';
    } else if (courseValue.includes('side')) {
      category = 'Sides';
    } else if (courseValue.includes('dessert') || courseValue.includes('sweet')) {
      category = 'Desserts';
    }
  }

  return { title, description, category };
}
