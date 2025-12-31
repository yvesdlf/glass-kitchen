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
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}
