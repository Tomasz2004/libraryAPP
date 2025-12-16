import apiRequest from './api';

const readerService = {
  getAll: async () => {
    return apiRequest('/wypozyczenia');
  },

  getById: async (id) => {
    return apiRequest(`/wypozyczenia/${id}`);
  },

  create: async (readerData) => {
    return apiRequest('/wypozyczenia', {
      method: 'POST',
      body: JSON.stringify(readerData),
    });
  },

  update: async (id, readerData) => {
    return apiRequest(`/wypozyczenia/${id}`, {
      method: 'PUT',
      body: JSON.stringify(readerData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/wypozyczenia/${id}`, { method: 'DELETE' });
  },
};

export default readerService;
