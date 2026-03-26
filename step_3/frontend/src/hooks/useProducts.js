import { useCallback, useMemo, useState } from 'react';

import productService from '../services/productService';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async ({ page = 1, limit = 10, search = '' } = {}) => {
    setLoading(true);
    setError('');
    try {
      const result = await productService.list({ page, limit, search });
      setProducts(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      await productService.create(payload);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create product');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, payload) => {
    setSubmitting(true);
    setError('');
    try {
      await productService.update(id, payload);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update product');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setSubmitting(true);
    setError('');
    try {
      await productService.remove(id);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete product');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return useMemo(
    () => ({
      products,
      meta,
      loading,
      submitting,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      clearError
    }),
    [
      products,
      meta,
      loading,
      submitting,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      clearError
    ]
  );
}
