import api from './api';

const toFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    formData.append(key, value);
  });

  return formData;
};

const productService = {
  list: async ({ page = 1, limit = 10, search = '' }) => {
    const response = await api.get('/products', { params: { page, limit, search } });
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/products', toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/products/${id}`, toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`/products/${id}`);
  }
};

export default productService;
