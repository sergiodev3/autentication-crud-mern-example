import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ErrorAlert from '../components/ErrorAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Navbar from '../components/Navbar.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductForm from '../components/ProductForm.jsx';
import useProducts from '../hooks/useProducts';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const {
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
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [editingProduct, setEditingProduct] = useState(null);
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formNonce, setFormNonce] = useState(0);
  const [activeView, setActiveView] = useState('products');

  const page = useMemo(() => Number(searchParams.get('page') || 1), [searchParams]);
  const limit = useMemo(() => Number(searchParams.get('limit') || 10), [searchParams]);
  const search = useMemo(() => searchParams.get('search') || '', [searchParams]);

  useEffect(() => {
    fetchProducts({ page, limit, search });
  }, [fetchProducts, page, limit, search]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSuccessMessage(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const refreshPage = () => {
    fetchProducts({ page, limit, search });
  };

  const handleSubmit = async (payload) => {
    const normalizedPayload = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      image: payload.image
    };

    const ok = editingProduct
      ? await updateProduct(editingProduct._id, normalizedPayload)
      : await createProduct(normalizedPayload);

    if (ok) {
      setSuccessMessage(editingProduct ? 'Product updated successfully.' : 'Product created successfully.');
      setEditingProduct(null);
      setFormNonce((value) => value + 1);
      setActiveView('products');
      refreshPage();
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteProduct?._id) {
      return;
    }

    const ok = await deleteProduct(pendingDeleteProduct._id);
    if (ok) {
      if (editingProduct?._id === pendingDeleteProduct._id) {
        setEditingProduct(null);
        setFormNonce((value) => value + 1);
      }
      setSuccessMessage('Product deleted successfully.');
      refreshPage();
    }

    setPendingDeleteProduct(null);
  };

  const handlePageChange = (nextPage) => {
    setSearchParams({ page: String(nextPage), limit: String(limit), search });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams({ page: '1', limit: String(limit), search: searchText.trim() });
  };

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.menuSection}>
        <button
          type="button"
          className={`${styles.menuButton} ${activeView === 'create' ? styles.menuButtonActive : ''}`}
          onClick={() => {
            clearError();
            setEditingProduct(null);
            setFormNonce((value) => value + 1);
            setActiveView('create');
          }}
        >
          Create Product
        </button>
        <button
          type="button"
          className={`${styles.menuButton} ${activeView === 'products' ? styles.menuButtonActive : ''}`}
          onClick={() => setActiveView('products')}
        >
          Your Products
        </button>
      </section>

      {successMessage && <p className={styles.successNotice}>{successMessage}</p>}

      {activeView === 'create' && (
        <section className={styles.formSection}>
          <ProductForm
            key={editingProduct ? `edit-${editingProduct._id}` : `create-${formNonce}`}
            mode={editingProduct ? 'edit' : 'create'}
            activeProduct={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              clearError();
              setEditingProduct(null);
            }}
            isSubmitting={submitting}
          />
        </section>
      )}

      {activeView === 'products' && (
        <section className={styles.listSection}>
          <div className={styles.topBar}>
            <h2>Your Products</h2>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by product name"
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <ErrorAlert message={error} />

          {loading ? (
            <LoadingSpinner label="Loading products" />
          ) : products.length === 0 ? (
            <p className={styles.empty}>No products found for current filters.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setActiveView('create');
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.danger}
                            onClick={() => setPendingDeleteProduct(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </section>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingDeleteProduct)}
        title="Delete product"
        description={
          pendingDeleteProduct
            ? `This action will permanently delete ${pendingDeleteProduct.name}.`
            : ''
        }
        confirmLabel={submitting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteProduct(null)}
        isLoading={submitting}
      />
    </main>
  );
}
