import apiRequest from './api';

const readerService = {
  getAll: async () => {
    return apiRequest('/czytelnicy');
  },

  getById: async (id) => {
    return apiRequest(`/czytelnicy/${id}`);
  },

  create: async (readerData) => {
    return apiRequest('/czytelnicy', {
      method: 'POST',
      body: JSON.stringify(readerData),
    });
  },

  update: async (id, readerData) => {
    return apiRequest(`/czytelnicy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(readerData),
    });
  },

  delete: async (id, cascade = false) => {
    const endpoint = cascade
      ? `/czytelnicy/${id}?cascade=true`
      : `/czytelnicy/${id}`;
    return apiRequest(endpoint, { method: 'DELETE' });
  },
};

export default readerService;
