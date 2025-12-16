import apiRequest from './api';

/**
 * Service do obsługi operacji na bibliotekach
 */
const libraryService = {
  /**
   * Pobiera wszystkich bibliotek
   */
  getAll: async () => {
    return apiRequest('/biblioteki');
  },

  /**
   * Pobiera bibliotekę po ID
   * @param {number} id - ID biblioteki
   */
  getById: async (id) => {
    return apiRequest(`/biblioteki/${id}`);
  },

  /**
   * Tworzy nową bibliotekę
   * @param {object} libraryData - dane biblioteki (nazwa, adres)
   */
  create: async (libraryData) => {
    return apiRequest('/biblioteki', {
      method: 'POST',
      body: JSON.stringify(libraryData),
    });
  },

  /**
   * Aktualizuje bibliotekę
   * @param {number} id - ID biblioteki
   * @param {object} libraryData - zaktualizowane dane biblioteki
   */
  update: async (id, libraryData) => {
    return apiRequest(`/biblioteki/${id}`, {
      method: 'PUT',
      body: JSON.stringify(libraryData),
    });
  },

  /**
   * Usuwa bibliotekę
   * @param {number} id - ID biblioteki
   * @param {boolean} cascade - czy usunąć powiązane rekordy
   */
  delete: async (id, cascade = false) => {
    const endpoint = cascade
      ? `/biblioteki/${id}?cascade=true`
      : `/biblioteki/${id}`;
    return apiRequest(endpoint, { method: 'DELETE' });
  },
};

export default libraryService;
