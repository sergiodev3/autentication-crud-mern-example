# Step 1 - Backend API (desde cero)

En este paso construyes el backend de la app MERN con:

1. Node.js + Express.
2. MongoDB + Mongoose.
3. Autenticacion JWT.
4. CRUD de productos protegido.

## Objetivo de aprendizaje

Al terminar Step 1 podras:

1. Registrar y autenticar usuarios.
2. Proteger rutas con middleware JWT.
3. Crear, listar, editar y eliminar productos.
4. Estructurar una API en capas (models, controllers, routes, middlewares).

## Requisitos

- Node.js 20+
- npm 10+
- MongoDB local o Atlas

## 1. Crear proyecto backend desde cero

```bash
mkdir -p step_1/backend
cd step_1/backend
npm init -y
npm pkg set type=module
```

## 2. Instalar dependencias (orden recomendado)

### 2.1 Base del servidor

```bash
npm install express dotenv cors
```

### 2.2 Base de datos y autenticacion

```bash
npm install mongoose bcryptjs jsonwebtoken
```

### 2.3 Validacion, seguridad y utilidades

```bash
npm install express-validator helmet morgan multer
```

### 2.4 Desarrollo

```bash
npm install -D nodemon
```

Dependencias finales usadas en este step:

- `bcryptjs`
- `cors`
- `dotenv`
- `express`
- `express-validator`
- `helmet`
- `jsonwebtoken`
- `mongoose`
- `morgan`
- `multer`
- `nodemon` (dev)

## 3. Scripts recomendados

En `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

## 4. Crear estructura de carpetas

```text
step_1/backend
  server.js
  .env.example
  src/
    app.js
    database/connection.js
    models/User.js
    models/Product.js
    utils/httpCodes.js
    utils/appError.js
    utils/asyncHandler.js
    validators/authValidators.js
    validators/productValidators.js
    middlewares/validate.js
    middlewares/authMiddleware.js
    middlewares/uploadMiddleware.js
    middlewares/notFound.js
    middlewares/errorHandler.js
    controllers/authController.js
    controllers/productController.js
    routes/authRoutes.js
    routes/productRoutes.js
  uploads/
```

## 5. Orden logico para escribir codigo

Si vas escribiendo desde cero, este orden te evita errores de dependencias entre archivos:

1. `server.js` y `src/app.js` (arranque de Express).
2. `src/database/connection.js` (conexion Mongo).
3. `src/models/User.js` y `src/models/Product.js`.
4. `src/utils/httpCodes.js`, `src/utils/appError.js`, `src/utils/asyncHandler.js`.
5. `src/validators/authValidators.js` y `src/validators/productValidators.js`.
6. `src/middlewares/validate.js`, `src/middlewares/authMiddleware.js`, `src/middlewares/uploadMiddleware.js`.
7. `src/controllers/authController.js` y `src/controllers/productController.js`.
8. `src/routes/authRoutes.js` y `src/routes/productRoutes.js`.
9. `src/middlewares/notFound.js` y `src/middlewares/errorHandler.js`.
10. Conectar todo en `src/app.js`.

## 6. Variables de entorno

Crear `step_1/backend/.env` basado en `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern_step_1
JWT_SECRET=change_me_super_secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

## 7. Ejecutar proyecto

```bash
cd step_1/backend
npm install
npm run dev
```

Health check:

- `GET http://localhost:5000/health`

## 8. Endpoints principales

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

## 9. Pruebas manuales (Thunder Client Free)

Guia rapida:

1. Ejecuta `register` y luego `login`.
2. Copia el token JWT manualmente.
3. Pegalo como `Authorization: Bearer TU_TOKEN` en rutas de productos.
4. Crea un producto y copia su `id` para pruebas de get/update/delete.

Nota: no se requieren variables de entorno de Thunder Client ni funciones premium.

## 10. Checklist antes de pasar a Step 2

1. Registro funciona.
2. Login devuelve token.
3. `/products` sin token devuelve 401.
4. CRUD completo funciona con token.
5. Validaciones de campos devuelven 422 cuando corresponde.
