import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import path from 'node:path';

import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../utils/httpCodes.js';

const removeImageFile = async (imagePath) => {
  if (!imagePath) {
    return;
  }

  const relativeImagePath = imagePath.replace(/^\/+/, '');
  const absoluteImagePath = path.join(process.cwd(), relativeImagePath);

  try {
    await fs.unlink(absoluteImagePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Failed to remove image file: ${absoluteImagePath}`);
    }
  }
};

export const createProduct = asyncHandler(async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const product = await Product.create({
    ...req.body,
    image,
    createdBy: req.user.userId
  });

  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  const filters = {
    createdBy: new mongoose.Types.ObjectId(req.user.userId)
  };

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filters)
  ]);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Products fetched successfully',
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user.userId
  });

  if (!product) {
    return next(new AppError('Product not found', HTTP_STATUS.NOT_FOUND));
  }

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Product fetched successfully',
    data: product
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.image = `/uploads/${req.file.filename}`;
  }

  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user.userId
  });

  if (!product) {
    const existsWithId = await Product.exists({ _id: req.params.id });
    if (existsWithId) {
      return next(new AppError('You are not allowed to update this product', HTTP_STATUS.FORBIDDEN));
    }
    return next(new AppError('Product not found', HTTP_STATUS.NOT_FOUND));
  }

  Object.assign(product, payload);
  await product.save();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user.userId
  });

  if (!product) {
    const existsWithId = await Product.exists({ _id: req.params.id });
    if (existsWithId) {
      return next(new AppError('You are not allowed to delete this product', HTTP_STATUS.FORBIDDEN));
    }
    return next(new AppError('Product not found', HTTP_STATUS.NOT_FOUND));
  }

  await removeImageFile(product.image);
  await product.deleteOne();
  return res.status(HTTP_STATUS.NO_CONTENT).send();
});
