import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { HTTP_STATUS } from './utils/httpCodes.js';
import swaggerSpec from './config/swagger.js';

const app = express();

const buildCorsOrigin = () => {
  const configured = process.env.CORS_ORIGIN;
  if (!configured) {
    return true;
  }

  const whitelist = configured.split(',').map((origin) => origin.trim());
  return (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  };
};

app.use(cors({ origin: buildCorsOrigin(), credentials: true }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verificar estado de la API
 *     description: Devuelve un objeto de estado confirmando que el servidor está en línea. No requiere autenticación.
 *     responses:
 *       200:
 *         description: API en línea
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
 *                   example: API is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-05-13T12:00:00.000Z'
 */
app.get('/api/v1/health', (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

/**
 * Swagger UI — documentación interactiva en /api-docs
 *
 * Por qué el middleware res.removeHeader va primero:
 *   Helmet agrega el header Content-Security-Policy a todas las respuestas.
 *   Swagger UI necesita ejecutar scripts inline y cargar assets propios,
 *   ambos bloqueados por la política CSP por defecto de Helmet.
 *   En lugar de deshabilitar Helmet globalmente, eliminamos el header CSP
 *   solo para las rutas bajo /api-docs. El resto de la API conserva
 *   todos sus headers de seguridad intactos.
 *
 * Por qué este bloque va ANTES de notFoundHandler:
 *   notFoundHandler captura cualquier ruta no registrada y devuelve 404 JSON.
 *   Si Swagger UI se montara después, todas las peticiones a /api-docs/*
 *   serían interceptadas por notFoundHandler antes de llegar aquí.
 */
app.use(
  '/api-docs',
  (_req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Products API Docs',
    swaggerOptions: {
      persistAuthorization: true  // conserva el JWT entre recargas de página
    }
  })
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
