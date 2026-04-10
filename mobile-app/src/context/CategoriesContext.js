import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getCategories,
  createCategory,
  toggleCategoryActive,
  deleteCategoryFromDB,
} from '../api/categories';
import { supabase } from '../api/supabaseClient';

const CategoriesContext = createContext({});

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.log('Categories fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for auth state — only fetch when user is logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchCategories();
        } else {
          setCategories([]);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const addCategory = async (category) => {
    try {
      const newCat = await createCategory(category);
      setCategories((prev) => [...prev, newCat]);
    } catch (err) {
      throw err;
    }
  };

  const toggleCategory = async (id) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    try {
      await toggleCategoryActive(id, !category.active);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, active: !cat.active } : cat
        )
      );
    } catch (err) {
      console.log('Toggle error:', err.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteCategoryFromDB(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.log('Delete error:', err.message);
    }
  };

  const activeCategories = categories.filter((cat) => cat.active);

  // Build icon map for expense list — case insensitive
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return '◈';
    const found = categories.find(
      (cat) => cat.label.toLowerCase() === categoryName.toLowerCase()
    );
    return found ? found.icon : '◈';
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      activeCategories,
      loading,
      addCategory,
      toggleCategory,
      deleteCategory,
      fetchCategories,
      getCategoryIcon,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export default CategoriesContext;
