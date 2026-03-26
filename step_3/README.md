# Step 3 - Seguridad, Testing, CI y Deploy (desde cero)

En este paso conviertes tu app MERN en una version lista para produccion:

1. Endureces seguridad backend.
2. Documentas API con Swagger.
3. Agregas tests backend/frontend.
4. Automatizas validaciones con CI en GitHub Actions.
5. Despliegas backend en Railway y frontend en Vercel.

## Objetivo de aprendizaje

Al finalizar Step 3 podras entregar un proyecto profesional, no solo un demo local.

## 1. Dependencias backend de Step 3

Ubicacion:

```bash
cd step_3/backend
```

### 1.1 Seguridad y documentacion

```bash
npm install helmet morgan express-rate-limit swagger-jsdoc swagger-ui-express
```

### 1.2 Testing backend

```bash
npm install -D jest supertest mongodb-memory-server babel-jest @babel/preset-env @jest/globals
```

Dependencias backend relevantes:

- Seguridad: `helmet`, `morgan`, `express-rate-limit`, `cors`.
- API docs: `swagger-jsdoc`, `swagger-ui-express`.
- Testing: `jest`, `supertest`, `mongodb-memory-server`, `babel-jest`.

## 2. Dependencias frontend de Step 3

Ubicacion:

```bash
cd step_3/frontend
```

### 2.1 Testing frontend

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

Dependencias frontend de pruebas:

- `vitest`
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `msw`

## 3. Orden logico de implementacion

### 3.1 Backend

1. Configura entorno: `.env.example`, `.env`.
2. Crea rate limit en `src/middlewares/authRateLimiter.js`.
3. Agrega Helmet, Morgan y CORS dinamico en `src/app.js`.
4. Crea Swagger config en `src/config/swagger.js`.
5. Expone docs en `/api-docs` desde `src/app.js`.
6. Verifica borrado de imagen en delete de productos (`src/controllers/productController.js`).
7. Configura `jest.config.cjs`, `babel.config.cjs`, `tests/setup.js`.
8. Crea pruebas de integracion en `tests/integration/auth.test.js` y `tests/integration/products.test.js`.

### 3.2 Frontend

1. Configura `vitest.config.js`.
2. Crea setup global en `src/test/setup.js`.
3. Configura mocks MSW en `src/test/mocks/server.js` y `src/test/mocks/handlers.js`.
4. Escribe pruebas de rutas protegidas en `src/test/ProtectedRoute.test.jsx`.
5. Escribe prueba de login en `src/test/LoginFlow.test.jsx`.

### 3.3 CI

1. Crea workflow en `.github/workflows/ci.yml`.
2. Job backend: install, lint, test.
3. Job frontend: install, lint, test, build.
4. Ejecuta en `push` y `pull_request` a `main` y `master`.

## 4. Variables de entorno

### Backend (`step_3/backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern_step_3
JWT_SECRET=change_me_super_secret
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:5000
AUTH_RATE_LIMIT_WINDOW_MINUTES=15
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

### Frontend (`step_3/frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 5. Ejecutar y validar local

### Backend

```bash
cd step_3/backend
npm install
npm run dev
```

```bash
npm run lint
npm test
```

Swagger:

- `http://localhost:5000/api-docs`

### Frontend

```bash
cd step_3/frontend
npm install
npm run dev
```

```bash
npm run lint
npm test
npm run build
```

## 6. Guia corta de deploy

### 6.1 Backend en Railway

1. Crea nuevo proyecto en Railway.
2. Conecta este repositorio de GitHub.
3. Selecciona root directory: `step_3/backend`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Agrega variables de entorno del backend.
7. Copia la URL publica (ejemplo: `https://tu-api.up.railway.app`).

### 6.2 Frontend en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona root directory: `step_3/frontend`.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output dir: `dist`.
6. Define `VITE_API_URL` apuntando a Railway (`https://tu-api.up.railway.app/api/v1`).
7. Deploy.

### 6.3 CORS en produccion

En backend, `CORS_ORIGINS` debe incluir:

1. `http://localhost:5173` (local).
2. `https://tu-frontend.vercel.app` (produccion).

## 7. Validacion final end-to-end

1. Register y login en frontend deployado.
2. Crear/editar/eliminar producto.
3. Revisar `/api-docs` deployado.
4. Confirmar que CI pasa en pull requests.
5. Confirmar que rutas protegidas rechazan requests sin token.
