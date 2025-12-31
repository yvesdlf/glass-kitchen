-- Create ingredients price list table
CREATE TABLE public.ingredient_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_code TEXT NOT NULL,
  category_name TEXT NOT NULL,
  description TEXT,
  base_unit TEXT NOT NULL DEFAULT 'G',
  conditioning NUMERIC DEFAULT 1000,
  price_per_unit NUMERIC(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_code)
);

-- Enable RLS
ALTER TABLE public.ingredient_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own ingredient prices"
ON public.ingredient_prices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ingredient prices"
ON public.ingredient_prices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredient prices"
ON public.ingredient_prices
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredient prices"
ON public.ingredient_prices
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ingredient_prices_updated_at
BEFORE UPDATE ON public.ingredient_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add yield_quantity and advanced fields to recipes table
ALTER TABLE public.recipes 
ADD COLUMN yield_quantity INTEGER DEFAULT 1,
ADD COLUMN yield_unit TEXT DEFAULT 'portions',
ADD COLUMN is_advanced BOOLEAN DEFAULT false,
ADD COLUMN recipe_ingredients JSONB DEFAULT '[]'::jsonb,
ADD COLUMN labor_cost NUMERIC(10,2) DEFAULT 0,
ADD COLUMN overhead_percent NUMERIC(5,2) DEFAULT 0,
ADD COLUMN target_food_cost_percent NUMERIC(5,2) DEFAULT 30;