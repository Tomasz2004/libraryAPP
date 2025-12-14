import apiRequest from './api';

/**
 * Service do obsługi operacji na książkach
 * Wszystkie funkcje zwracają Promise
 */
const bookService = {
  /**
   * Pobiera wszystkie książki (z opcjonalnymi filtrami)
   * @param {object} filters - opcjonalne filtry (tytul, autor, gatunek, rokWydania)
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/ksiazki?${queryString}` : '/ksiazki';

    return apiRequest(endpoint);
  },

  /**
   * Pobiera książkę po ID
   * @param {number} id - ID książki
   */
  getById: async (id) => {
    return apiRequest(`/ksiazki/${id}`);
  },

  /**
   * Tworzy nową książkę
   * @param {object} bookData - dane książki (tytul, autorId, gatunek, etc.)
   */
  create: async (bookData) => {
    return apiRequest('/ksiazki', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  /**
   * Aktualizuje książkę
   * @param {number} id - ID książki
   * @param {object} bookData - zaktualizowane dane książki
   */
  update: async (id, bookData) => {
    return apiRequest(`/ksiazki/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  /**
   * Usuwa książkę
   * @param {number} id - ID książki
   * @param {boolean} cascade - czy usunąć wraz z egzemplarzami
   */
  delete: async (id, cascade = false) => {
    const endpoint = cascade ? `/ksiazki/${id}?cascade=true` : `/ksiazki/${id}`;
    return apiRequest(endpoint, { method: 'DELETE' });
  },
};

export default bookService;
