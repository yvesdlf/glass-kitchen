export interface IngredientPrice {
  id: string;
  user_id: string;
  item_code: string;
  category_name: string;
  description?: string;
  base_unit: string;
  conditioning: number;
  price_per_unit: number;
  initial_weight: number;
  waste_weight: number;
  yield_weight: number;
  wastage_percent: number;
  true_cost: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price_per_unit?: number;
  conditioning?: number;
  wastage_percent?: number;
  true_cost?: number;
  total_cost?: number;
}

export interface RecipeCosting {
  ingredient_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
  cost_per_portion: number;
  suggested_price: number;
  food_cost_percent: number;
}
