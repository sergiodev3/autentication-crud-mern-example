import swaggerJSDoc from 'swagger-jsdoc';

const servers = [];

if (process.env.BACKEND_PUBLIC_URL) {
  servers.push({ url: `${process.env.BACKEND_PUBLIC_URL}/api/v1`, description: 'Production' });
}

servers.push({ url: 'http://localhost:5000/api/v1', description: 'Local' });

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Step 3 MERN API',
      version: '1.0.0',
      description: 'JWT auth + products CRUD API'
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: { '200': { description: 'API healthy' } }
        }
      },
      '/auth/register': {
        post: {
          summary: 'Register user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { '201': { description: 'User created' }, '400': { description: 'Validation error' } }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Login success' }, '401': { description: 'Invalid credentials' } }
        }
      },
      '/products': {
        get: {
          summary: 'List products',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Products list' }, '401': { description: 'Unauthorized' } }
        },
        post: {
          summary: 'Create product',
          security: [{ bearerAuth: [] }],
          responses: { '201': { description: 'Product created' }, '422': { description: 'Validation error' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
