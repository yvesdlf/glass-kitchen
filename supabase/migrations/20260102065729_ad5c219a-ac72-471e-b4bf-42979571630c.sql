-- Add wastage fields to ingredient_prices table
ALTER TABLE public.ingredient_prices 
ADD COLUMN IF NOT EXISTS initial_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS waste_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS yield_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS wastage_percent numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS true_cost numeric DEFAULT 0;