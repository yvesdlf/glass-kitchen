import { Recipe } from "@/models/Recipe";

// TODO: Recipe service protocol for future implementation
// Will handle CRUD operations for recipes, markdown parsing, and photo management

export interface RecipeService {
  // Get all recipes for the current user
  getRecipes(): Promise<Recipe[]>;
  
  // Get a single recipe by ID
  getRecipe(id: string): Promise<Recipe | null>;
  
  // Create a new recipe
  createRecipe(recipe: Omit<Recipe, "id">): Promise<Recipe>;
  
  // Update an existing recipe
  updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe>;
  
  // Delete a recipe
  deleteRecipe(id: string): Promise<void>;
  
  // TODO: Future methods
  // parseMarkdownRecipe(markdown: string): Promise<Recipe>;
  // importFromPhoto(imageFile: File): Promise<Recipe>;
  // scaleServings(recipeId: string, newServings: number): Promise<Recipe>;
}

// Placeholder implementation
export const recipeService: RecipeService = {
  async getRecipes() {
    // TODO: Implement with Supabase
    return [];
  },
  
  async getRecipe(id) {
    // TODO: Implement with Supabase
    return null;
  },
  
  async createRecipe(recipe) {
    // TODO: Implement with Supabase
    return { ...recipe, id: crypto.randomUUID() };
  },
  
  async updateRecipe(id, recipe) {
    // TODO: Implement with Supabase
    return { id, title: recipe.title || "", ...recipe };
  },
  
  async deleteRecipe(id) {
    // TODO: Implement with Supabase
  },
};
