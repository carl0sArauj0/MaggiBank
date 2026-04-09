import React, { createContext, useState, useContext } from 'react';

const DEFAULT_CATEGORIES = [
  { id: '1', label: 'Comida', icon: '🍔', active: true, isDefault: true },
  { id: '2', label: 'Transporte', icon: '🚗', active: true, isDefault: true },
  { id: '3', label: 'Arriendo', icon: '🏠', active: true, isDefault: true },
  { id: '4', label: 'Salud', icon: '💊', active: true, isDefault: true },
  { id: '5', label: 'Entretenimiento', icon: '🎬', active: true, isDefault: true },
  { id: '6', label: 'Ropa', icon: '👕', active: true, isDefault: true },
  { id: '7', label: 'Educación', icon: '📚', active: true, isDefault: true },
  { id: '8', label: 'Otros', icon: '◈', active: true, isDefault: true },
];

const CategoriesContext = createContext({});

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const addCategory = (category) => {
    setCategories((prev) => [...prev, category]);
  };

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const activeCategories = categories.filter((cat) => cat.active);

  return (
    <CategoriesContext.Provider value={{
      categories,
      activeCategories,
      addCategory,
      toggleCategory,
      deleteCategory,
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
