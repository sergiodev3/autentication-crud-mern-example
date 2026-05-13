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

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos (paginado)
 *     description: |
 *       Devuelve una lista paginada de los productos del usuario autenticado.
 *       Usa el parámetro `search` para filtrar por nombre (regex sin distinción de mayúsculas).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página (base 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de productos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra productos cuyo nombre contenga esta cadena
 *     responses:
 *       200:
 *         description: Productos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Token JWT faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listProductsValidation, validate, getProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener un producto por ID
 *     description: |
 *       Recupera un producto por su ID. El producto debe pertenecer al usuario autenticado;
 *       si es de otro usuario se devuelve `403 Forbidden`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del producto
 *         example: 664b2a3c4d5e6f7a8b9c0d1e
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El producto no pertenece al usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', productIdValidation, validate, getProductById);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Crear producto
 *     description: |
 *       Crea un producto asociado al usuario autenticado.
 *       Acepta `multipart/form-data` para poder subir una imagen opcional en la misma petición.
 *       La imagen se guarda en disco bajo `/uploads/` y la ruta relativa se persiste en la base de datos.
 *
 *       **Límites de imagen:** solo tipos `image/*`, máximo **5 MB**.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Wireless Mouse
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: Ratón inalámbrico ergonómico con receptor USB
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 29.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 150
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (JPEG, PNG, etc. — máx 5 MB). Opcional.
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', upload.single('image'), createProductValidation, validate, createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Actualizar producto
 *     description: |
 *       Actualiza uno o varios campos de un producto existente.
 *       Todos los campos son opcionales — solo se modifican los que envíes.
 *       Si se sube una nueva imagen, la anterior es reemplazada en disco.
 *       Solo el dueño del producto puede actualizarlo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del producto
 *         example: 664b2a3c4d5e6f7a8b9c0d1e
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Wireless Mouse Pro
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: Descripción actualizada
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 34.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 200
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen para reemplazar la existente. Opcional.
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: No tienes permiso para modificar este producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', productIdValidation, updateProductValidation, validate, upload.single('image'), updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Eliminar producto
 *     description: |
 *       Elimina permanentemente el producto y su archivo de imagen en disco.
 *       Solo el dueño del producto puede eliminarlo.
 *       Devuelve HTTP **204 sin body** si la operación es exitosa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del producto
 *         example: 664b2a3c4d5e6f7a8b9c0d1e
 *     responses:
 *       204:
 *         description: Producto eliminado — sin contenido en el body
 *       401:
 *         description: Token JWT faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: No tienes permiso para eliminar este producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', productIdValidation, validate, deleteProduct);

export default router;
