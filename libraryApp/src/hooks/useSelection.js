import { useState } from 'react';

/**
 * Custom hook do zarządzania zaznaczaniem elementów w liście
 * @param {string} idKey - Nazwa klucza ID w obiektach (np. 'ksiazkaId', 'autorId')
 * @returns {Object} Stan i metody do zarządzania zaznaczeniem
 */
export function useSelection(idKey = 'id') {
  const [selectedIds, setSelectedIds] = useState([]);

  /**
   * Przełącza zaznaczenie pojedynczego elementu
   */
  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  /**
   * Zaznacza wszystkie elementy lub odznacza wszystkie
   */
  const toggleAll = (items) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item[idKey]));
    }
  };

  /**
   * Sprawdza czy element jest zaznaczony
   */
  const isSelected = (id) => selectedIds.includes(id);

  /**
   * Sprawdza czy wszystkie elementy są zaznaczone
   */
  const isAllSelected = (items) =>
    selectedIds.length === items.length && items.length > 0;

  /**
   * Czyści zaznaczenie
   */
  const clearSelection = () => setSelectedIds([]);

  /**
   * Ustawia konkretne ID jako zaznaczone
   */
  const setSelection = (ids) => setSelectedIds(ids);

  return {
    selectedIds,
    toggleItem,
    toggleAll,
    isSelected,
    isAllSelected,
    clearSelection,
    setSelection,
    count: selectedIds.length,
  };
}
