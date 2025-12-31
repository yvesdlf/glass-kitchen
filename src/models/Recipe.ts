// TODO: Recipe model for future implementation
// Will support markdown-based recipes with photo attachments, yield scaling, and notes

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  // TODO: Add these fields when implementing recipe features
  // ingredients: Ingredient[];
  // instructions: string[];
  // servings: number;
  // prepTime: number;
  // cookTime: number;
  // imageUrl?: string;
  // notes?: string;
  // tags?: string[];
  // createdAt: Date;
  // updatedAt: Date;
}

// Placeholder for future ingredient type
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}
