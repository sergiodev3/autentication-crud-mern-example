import swaggerJsdoc from 'swagger-jsdoc';

/**
 * openApiDefinition: el "esqueleto" de la especificación OpenAPI 3.0.
 *
 * Este objeto describe tu API a alto nivel:
 *   - openapi   → versión de la especificación que seguimos (3.0.3)
 *   - info      → metadatos visibles en el encabezado de Swagger UI
 *   - servers   → le dice a la UI a qué URL enviar las peticiones reales
 *   - components → schemas y securitySchemes reutilizables
 *
 * swagger-jsdoc va a FUSIONAR este objeto con los bloques @openapi
 * que encuentre en los archivos definidos en `apis` (más abajo).
 * El resultado final es el objeto `spec` que se exporta.
 */
const openApiDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Products API',
    version: '1.0.0',
    description:
      'REST API de autenticación y gestión de productos. ' +
      'Regístrate o inicia sesión para obtener un JWT, luego usa el botón **Authorize** ' +
      'para desbloquear los endpoints protegidos.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor local de desarrollo'
    }
  ],
  components: {
    /**
     * securitySchemes: define los mecanismos de autenticación que la API soporta.
     *
     * `bearerAuth` es el nombre que le damos al esquema JWT Bearer.
     * Cualquier endpoint que escriba `security: [{ bearerAuth: [] }]`
     * en su bloque JSDoc mostrará automáticamente el ícono de candado en la UI
     * y enviará el header `Authorization: Bearer <token>` en cada petición.
     */
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Pega aquí tu JWT **sin** el prefijo "Bearer ". ' +
          'Obtenlo ejecutando POST /api/v1/auth/login desde la UI.'
      }
    },
    /**
     * schemas: formas de objetos reutilizables.
     *
     * Definirlas aquí una sola vez permite referirlas en cualquier endpoint con:
     *   $ref: '#/components/schemas/Product'
     * Esto evita repetir la misma estructura en cada bloque JSDoc.
     */
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id:       { type: 'string',  example: '664a1f2e3b4c5d6e7f8a9b0c' },
          name:      { type: 'string',  example: 'Jane Doe' },
          email:     { type: 'string',  format: 'email', example: 'jane@example.com' },
          createdAt: { type: 'string',  format: 'date-time' },
          updatedAt: { type: 'string',  format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id:         { type: 'string',  example: '664b2a3c4d5e6f7a8b9c0d1e' },
          name:        { type: 'string',  example: 'Wireless Mouse' },
          description: { type: 'string',  example: 'Ratón inalámbrico ergonómico con receptor USB' },
          price:       { type: 'number',  format: 'float', example: 29.99 },
          stock:       { type: 'integer', example: 150 },
          image:       { type: 'string',  example: '/uploads/1716400000000-mouse.jpg' },
          createdBy:   { type: 'string',  example: '664a1f2e3b4c5d6e7f8a9b0c' },
          createdAt:   { type: 'string',  format: 'date-time' },
          updatedAt:   { type: 'string',  format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string',  example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              user:  { $ref: '#/components/schemas/User' },
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string',  example: 'Validation error - email: Email must be valid' }
        }
      }
    }
  }
};

/**
 * swaggerJsdocOptions: le dice a swagger-jsdoc CÓMO construir la spec.
 *
 * `definition` → el esqueleto OpenAPI que definimos arriba.
 * `apis`       → glob de archivos que contienen bloques @openapi.
 *
 * IMPORTANTE: los paths en `apis` son RELATIVOS AL DIRECTORIO
 * desde donde se ejecuta `node server.js` (es decir, la carpeta `backend/`),
 * NO relativos a la ubicación de este archivo.
 */
const swaggerJsdocOptions = {
  definition: openApiDefinition,
  apis: [
    './src/app.js',               // el endpoint /health está definido inline aquí
    './src/routes/authRoutes.js',
    './src/routes/productRoutes.js'
  ]
};

/**
 * spec: el objeto OpenAPI 3.0 completamente resuelto.
 *
 * swagger-jsdoc lee los archivos de `apis`, parsea cada bloque @openapi
 * en formato YAML, y los fusiona con `openApiDefinition`.
 * Este objeto es el que swagger-ui-express renderiza en el navegador.
 */
const spec = swaggerJsdoc(swaggerJsdocOptions);

export default spec;
