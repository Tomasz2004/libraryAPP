import { useState, useMemo } from 'react';

/**
 * Hook do paginacji danych w tabelach
 * @param {Array} data - Dane do paginacji
 * @param {number} initialItemsPerPage - Początkowa liczba elementów na stronę
 * @returns {Object} - Spaginowane dane i funkcje do zarządzania paginacją
 */
const usePagination = (data, initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const changeItemsPerPage = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie liczby elementów
  };

  // Reset strony gdy dane się zmienią
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data?.length || 0),
    totalItems: data?.length || 0,
  };
};

export default usePagination;
