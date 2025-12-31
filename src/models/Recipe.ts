export type RecipeCategory = 
  | 'Appetiser' 
  | 'Crudo' 
  | 'Salads' 
  | 'Mains' 
  | 'Sides' 
  | 'Desserts';

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  'Appetiser',
  'Crudo',
  'Salads',
  'Mains',
  'Sides',
  'Desserts'
];

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: RecipeCategory;
  markdown_content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  // Advanced fields
  yield_quantity?: number;
  yield_unit?: string;
  is_advanced?: boolean;
  recipe_ingredients?: any[];
  labor_cost?: number;
  overhead_percent?: number;
  target_food_cost_percent?: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}
