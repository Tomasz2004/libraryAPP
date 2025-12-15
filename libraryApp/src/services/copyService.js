import apiRequest from './api';

const copyService = {
  getAll: async () => {
    return apiRequest('/egzemplarze');
  },

  getById: async (id) => {
    return apiRequest(`/egzemplarze/${id}`);
  },

  create: async (copyData) => {
    return apiRequest('/egzemplarze', {
      method: 'POST',
      body: JSON.stringify(copyData),
    });
  },

  update: async (id, copyData) => {
    return apiRequest(`/egzemplarze/${id}`, {
      method: 'PUT',
      body: JSON.stringify(copyData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/egzemplarze/${id}`, { method: 'DELETE' });
  },
};

export default copyService;
