import apiRequest from './api';

const copyService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const queryString = params.toString();
    const endpoint = queryString
      ? `/egzemplarze?${queryString}`
      : '/egzemplarze';

    return apiRequest(endpoint);
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

  delete: async (id, cascade = false) => {
    const endpoint = cascade
      ? `/egzemplarze/${id}?cascade=true`
      : `/egzemplarze/${id}`;
    return apiRequest(endpoint, { method: 'DELETE' });
  },
};

export default copyService;
