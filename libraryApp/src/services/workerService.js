import apiRequest from './api';

const workerService = {
  getAll: async () => {
    return apiRequest('/pracownicy');
  },

  getById: async (id) => {
    return apiRequest(`/pracownicy/${id}`);
  },

  create: async (workerData) => {
    return apiRequest('/pracownicy', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
  },

  update: async (id, workerData) => {
    return apiRequest(`/pracownicy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workerData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/pracownicy/${id}`, { method: 'DELETE' });
  },
};

export default workerService;
