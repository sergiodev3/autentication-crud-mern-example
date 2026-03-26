import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import validate from '../middlewares/validate.js';
import {
  createProductValidation,
  listProductsValidation,
  productIdValidation,
  updateProductValidation
} from '../validators/productValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listProductsValidation, validate, getProducts);
router.get('/:id', productIdValidation, validate, getProductById);
router.post('/', upload.single('image'), createProductValidation, validate, createProduct);
router.put('/:id', productIdValidation, updateProductValidation, validate, upload.single('image'), updateProduct);
router.delete('/:id', productIdValidation, validate, deleteProduct);

export default router;
