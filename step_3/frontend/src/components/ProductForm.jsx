import { useEffect, useMemo, useState } from 'react';

import styles from './ProductForm.module.css';

const initialState = {
  name: '',
  description: '',
  price: '',
  stock: ''
};

const buildFormFromProduct = (product) => {
  if (!product) {
    return initialState;
  }

  return {
    name: product.name || '',
    description: product.description || '',
    price: product.price ?? '',
    stock: product.stock ?? ''
  };
};

export default function ProductForm({
  mode,
  activeProduct,
  onSubmit,
  onCancel,
  isSubmitting
}) {
  const assetBase = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return apiUrl.replace(/\/api\/v1\/?$/, '');
  }, []);

  const startingPreview =
    activeProduct?.image
      ? activeProduct.image.startsWith('http')
        ? activeProduct.image
        : `${assetBase}${activeProduct.image}`
      : '';

  const [form, setForm] = useState(() => buildFormFromProduct(activeProduct));
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(startingPreview);

  useEffect(() => () => {
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  }, [preview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: imageFile
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{mode === 'edit' ? 'Edit Product' : 'Create Product'}</h2>

      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
      </label>

      <div className={styles.grid}>
        <label>
          Price
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
        </label>

        <label>
          Stock
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
        </label>
      </div>

      <label>
        Image
        <input name="image" type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {preview && (
        <div className={styles.previewWrap}>
          <p>Image preview</p>
          <img src={preview} alt="Preview" className={styles.preview} />
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
        </button>
        {mode === 'edit' && (
          <button type="button" className={styles.secondary} onClick={onCancel}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
