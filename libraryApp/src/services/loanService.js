import apiRequest from './api';

const loanService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const queryString = params.toString();
    const endpoint = queryString
      ? `/wypozyczenia?${queryString}`
      : '/wypozyczenia';

    return apiRequest(endpoint);
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

export default loanService;
