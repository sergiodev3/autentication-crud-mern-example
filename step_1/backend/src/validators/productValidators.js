import { body, param, query } from 'express-validator';

export const productIdValidation = [
  param('id').isMongoId().withMessage('Product id must be a valid MongoDB id')
];

export const listProductsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('search must be a string')
];

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('name is required').isLength({ min: 2, max: 100 }).withMessage('name length must be between 2 and 100'),
  body('description').trim().notEmpty().withMessage('description is required').isLength({ min: 5, max: 500 }).withMessage('description length must be between 5 and 500'),
  body('price').notEmpty().withMessage('price is required').isFloat({ min: 0 }).withMessage('price must be greater than or equal to 0'),
  body('stock').notEmpty().withMessage('stock is required').isInt({ min: 0 }).withMessage('stock must be an integer >= 0')
];

export const updateProductValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('name length must be between 2 and 100'),
  body('description').optional().trim().isLength({ min: 5, max: 500 }).withMessage('description length must be between 5 and 500'),
  body('price').optional().isFloat({ min: 0 }).withMessage('price must be greater than or equal to 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock must be an integer >= 0')
];
