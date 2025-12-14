import apiRequest from './api';

/**
 * Service do obsługi operacji na autorach
 */
const authorService = {
  /**
   * Pobiera wszystkich autorów
   */
  getAll: async () => {
    return apiRequest('/autorzy');
  },

  /**
   * Pobiera autora po ID
   * @param {number} id - ID autora
   */
  getById: async (id) => {
    return apiRequest(`/autorzy/${id}`);
  },

  /**
   * Tworzy nowego autora
   * @param {object} authorData - dane autora (imie, nazwisko, dataUrodzenia, kraj)
   */
  create: async (authorData) => {
    return apiRequest('/autorzy', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  },

  /**
   * Aktualizuje autora
   * @param {number} id - ID autora
   * @param {object} authorData - zaktualizowane dane autora
   */
  update: async (id, authorData) => {
    return apiRequest(`/autorzy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData),
    });
  },

  /**
   * Usuwa autora
   * @param {number} id - ID autora
   */
  delete: async (id) => {
    return apiRequest(`/autorzy/${id}`, { method: 'DELETE' });
  },
};

export default authorService;
