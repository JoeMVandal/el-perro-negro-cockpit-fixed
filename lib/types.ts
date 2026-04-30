// Database types
export interface User {
  id: string
  email: string
  name: string
  role: 'manager' | 'bartender'
  created_at: string
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  cost_per_unit: number
  supplier?: string
  shelf_life_days?: number
  created_at: string
}

export interface Recipe {
  id: string
  name: string
  category: string
  base_spirit?: string
  components: RecipeComponent[]
  pour_cost: number
  instructions?: string
  created_at: string
}

export interface RecipeComponent {
  ingredient_id: string
  amount: number
  unit: string
}

export interface InventoryItem {
  id: string
  ingredient_id: string
  location: 'main_bar' | 'service_well' | 'back_stock' | 'walk_in'
  amount: number
  unit: string
  last_counted: string
  reorder_point: number
}

export interface PrepListItem {
  id: string
  recipe_id: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Count {
  id: string
  date: string
  created_by: string
  items: CountItem[]
}

export interface CountItem {
  ingredient_id: string
  location: string
  amount: number
  unit: string
}

export interface StaffNote {
  id: string
  content: string
  created_by: string
  created_at: string
  category?: string
}
