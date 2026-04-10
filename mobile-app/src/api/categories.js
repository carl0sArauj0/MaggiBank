import { supabase } from './supabaseClient';

const DEFAULT_CATEGORIES = [
  { label: 'Comida', icon: '🍔', active: true, is_default: true },
  { label: 'Transporte', icon: '🚗', active: true, is_default: true },
  { label: 'Arriendo', icon: '🏠', active: true, is_default: true },
  { label: 'Salud', icon: '💊', active: true, is_default: true },
  { label: 'Entretenimiento', icon: '🎬', active: true, is_default: true },
  { label: 'Ropa', icon: '👕', active: true, is_default: true },
  { label: 'Educación', icon: '📚', active: true, is_default: true },
  { label: 'Otros', icon: '◈', active: true, is_default: true },
];

export const getCategories = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // If no categories exist yet, seed the defaults
  if (!data || data.length === 0) {
    const toInsert = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      user_id: user.id,
    }));
    const { data: seeded, error: seedError } = await supabase
      .from('categories')
      .insert(toInsert)
      .select();
    if (seedError) throw seedError;
    return seeded;
  }

  return data;
};

export const createCategory = async (category) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('categories')
    .insert([{
      label: category.label,
      icon: category.icon,
      active: true,
      is_default: false,
      user_id: user.id,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleCategoryActive = async (id, active) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ active })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategoryFromDB = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
