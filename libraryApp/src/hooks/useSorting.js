import { useState, useMemo } from 'react';

/**
 * Hook do sortowania danych w tabelach
 * @param {Array} data - Dane do sortowania
 * @param {Object} sortConfig - Konfiguracja sortowania dla poszczególnych pól
 * @returns {Object} - Posortowane dane i funkcje do zarządzania sortowaniem
 */
const useSorting = (data, sortConfig = {}) => {
  const [sort, setSort] = useState({ by: '', dir: 'asc' });

  const handleSort = (by) => {
    if (sort.by === by) {
      setSort({ by, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ by, dir: 'asc' });
    }
  };

  const getSortIcon = (by) => {
    if (sort.by !== by) return '';
    return sort.dir === 'asc' ? '▲' : '▼';
  };

  const sortedData = useMemo(() => {
    if (!sort.by || !data) return data;

    const copy = [...data];
    const sortFn = sortConfig[sort.by];

    if (sortFn) {
      copy.sort((a, b) => {
        const result = sortFn(a, b);
        return sort.dir === 'asc' ? result : -result;
      });
    } else {
      // Domyślne sortowanie (string lub number)
      copy.sort((a, b) => {
        const av = a[sort.by];
        const bv = b[sort.by];

        if (typeof av === 'string' && typeof bv === 'string') {
          return av.toLowerCase().localeCompare(bv.toLowerCase());
        }

        if (typeof av === 'number' && typeof bv === 'number') {
          return av - bv;
        }

        return 0;
      });

      if (sort.dir === 'desc') copy.reverse();
    }

    return copy;
  }, [data, sort, sortConfig]);

  return {
    sort,
    sortedData,
    handleSort,
    getSortIcon,
  };
};

export default useSorting;
