-- El Perro Negro Cockpit Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- ============ CREATE TABLES ============

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'bartender' CHECK (role IN ('manager', 'bartender')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit DECIMAL(10,2) NOT NULL,
  supplier TEXT,
  shelf_life_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  base_spirit TEXT,
  instructions TEXT,
  pour_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Components (ingredients in a recipe)
CREATE TABLE IF NOT EXISTS recipe_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  amount DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  location TEXT NOT NULL CHECK (location IN ('main_bar', 'service_well', 'back_stock', 'walk_in')),
  amount DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  last_counted TIMESTAMP WITH TIME ZONE,
  reorder_point DECIMAL(10,2) DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prep List Items
CREATE TABLE IF NOT EXISTS prep_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Counts (history)
CREATE TABLE IF NOT EXISTS counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Notes
CREATE TABLE IF NOT EXISTS staff_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ CREATE INDEXES ============

CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_inventory_ingredient ON inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location);
CREATE INDEX IF NOT EXISTS idx_prep_list_recipe ON prep_list_items(recipe_id);
CREATE INDEX IF NOT EXISTS idx_staff_notes_category ON staff_notes(category);
CREATE INDEX IF NOT EXISTS idx_staff_notes_created ON staff_notes(created_at DESC);

-- ============ ENABLE ROW LEVEL SECURITY ============

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_notes ENABLE ROW LEVEL SECURITY;

-- ============ CREATE RLS POLICIES ============

-- User Profiles - authenticated users can read all, only own profile can be updated
CREATE POLICY "Enable read for authenticated users" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable users to update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ingredients - all authenticated users can read
CREATE POLICY "Enable read for authenticated users" ON ingredients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for managers" ON ingredients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

CREATE POLICY "Enable update for managers" ON ingredients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

-- Recipes - all authenticated users can read
CREATE POLICY "Enable read for authenticated users" ON recipes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for managers" ON recipes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

-- Recipe Components
CREATE POLICY "Enable read for authenticated users" ON recipe_components
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for managers" ON recipe_components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

-- Inventory - all authenticated users can read
CREATE POLICY "Enable read for authenticated users" ON inventory
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for managers" ON inventory
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

CREATE POLICY "Enable update for managers" ON inventory
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'manager'
    )
  );

-- Prep List Items - all authenticated users can read
CREATE POLICY "Enable read for authenticated users" ON prep_list_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for all authenticated" ON prep_list_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for all authenticated" ON prep_list_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Staff Notes - all authenticated users can read
CREATE POLICY "Enable read for authenticated users" ON staff_notes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for all authenticated" ON staff_notes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============ CREATE FUNCTIONS ============

-- Function to sync auth.users to user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (new.id, new.email, new.user_metadata->>'full_name', 'bartender')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
