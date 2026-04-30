import { supabase } from './supabase'
import type {
  Ingredient,
  Recipe,
  RecipeComponent,
  InventoryItem,
  PrepListItem,
  StaffNote,
  Count,
  CountItem,
  User,
} from './types'

// ============ INGREDIENTS ============

export async function getIngredients() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Ingredient[]
}

export async function getIngredient(id: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Ingredient
}

export async function createIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([ingredient])
    .select()
    .single()

  if (error) throw error
  return data as Ingredient
}

export async function updateIngredient(id: string, updates: Partial<Ingredient>) {
  const { data, error } = await supabase
    .from('ingredients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Ingredient
}

export async function deleteIngredient(id: string) {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ RECIPES ============

export async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Recipe[]
}

export async function getRecipe(id: string) {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (recipeError) throw recipeError

  const { data: components, error: componentsError } = await supabase
    .from('recipe_components')
    .select('*')
    .eq('recipe_id', id)

  if (componentsError) throw componentsError

  return {
    ...recipe,
    components: components || [],
  } as Recipe
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select()
    .single()

  if (error) throw error
  return data as Recipe
}

export async function updateRecipe(id: string, updates: Partial<Recipe>) {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Recipe
}

export async function deleteRecipe(id: string) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ RECIPE COMPONENTS ============

export async function addRecipeComponent(component: Omit<RecipeComponent, 'id'>) {
  const { data, error } = await supabase
    .from('recipe_components')
    .insert([component])
    .select()
    .single()

  if (error) throw error
  return data as RecipeComponent
}

export async function deleteRecipeComponent(id: string) {
  const { error } = await supabase
    .from('recipe_components')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ INVENTORY ============

export async function getInventory() {
  const { data: inventory, error: invError } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at')

  if (invError) throw invError

  const ingredientIds = [...new Set(inventory?.map(i => i.ingredient_id) || [])]
  
  if (ingredientIds.length === 0) return []

  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('*')
    .in('id', ingredientIds)

  if (ingError) throw ingError

  return inventory?.map(item => ({
    ...item,
    ingredient: ingredients?.find(ing => ing.id === item.ingredient_id),
  })) || []
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'last_counted' | 'created_at'>) {
  const { data, error } = await supabase
    .from('inventory')
    .insert([{ ...item, last_counted: new Date() }])
    .select()
    .single()

  if (error) throw error
  return data as InventoryItem
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as InventoryItem
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function saveCount(items: CountItem[]) {
  const userId = (await supabase.auth.getUser()).data.user?.id

  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('counts')
    .insert([
      {
        date: new Date(),
        created_by: userId,
        items,
      },
    ])
    .select()
    .single()

  if (error) throw error

  // Update inventory with new counts
  for (const item of items) {
    const { data: invItems } = await supabase
      .from('inventory')
      .select('id')
      .eq('ingredient_id', item.ingredient_id)
      .eq('location', item.location)
      .single()

    if (invItems?.id) {
      await updateInventoryItem(invItems.id, {
        amount: item.amount,
        last_counted: new Date().toISOString(),
      })
    }
  }

  return data as Count
}

// ============ PREP LISTS ============

export async function getPrepList() {
  const { data, error } = await supabase
    .from('prep_list_items')
    .select('*')
    .order('created_at')

  if (error) throw error
  return data as PrepListItem[]
}

export async function createPrepListItem(recipeId: string) {
  const { data, error } = await supabase
    .from('prep_list_items')
    .insert([{ recipe_id: recipeId }])
    .select()
    .single()

  if (error) throw error
  return data as PrepListItem
}

export async function togglePrepListItem(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from('prep_list_items')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PrepListItem
}

export async function deletePrepListItem(id: string) {
  const { error } = await supabase
    .from('prep_list_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ STAFF NOTES ============

export async function getStaffNotes() {
  const { data, error } = await supabase
    .from('staff_notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StaffNote[]
}

export async function createStaffNote(note: Omit<StaffNote, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('staff_notes')
    .insert([note])
    .select()
    .single()

  if (error) throw error
  return data as StaffNote
}

export async function deleteStaffNote(id: string) {
  const { error } = await supabase
    .from('staff_notes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ AUTH ============

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as User | null
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function listUsers() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as User[]
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
