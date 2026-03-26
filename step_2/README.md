# Step 2 - Frontend React con Vite (desde cero)

En este paso construyes el frontend de la app MERN y lo conectas al backend del Step 1.

## Objetivo de aprendizaje

Al terminar Step 2 podras:

1. Crear una SPA con React + Vite.
2. Implementar login/registro con JWT.
3. Proteger rutas privadas.
4. Hacer CRUD de productos desde UI.

## Requisitos

- Haber completado Step 1.
- Backend activo en `http://localhost:5000`.
- Node.js 20+.

## 1. Crear el proyecto con Vite

```bash
cd step_2
npm create vite@latest frontend -- --template react
cd frontend
```

## 2. Instalar dependencias (orden recomendado)

### 2.1 Dependencias de aplicacion

```bash
npm install react-router-dom axios
```

### 2.2 Dependencias de desarrollo

```bash
npm install -D eslint @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh @vitejs/plugin-react
```

Dependencias principales usadas en este step:

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `vite`
- `eslint` y plugins

## 3. Variables de entorno

Crear `step_2/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 4. Orden logico para escribir el frontend

Sigue este orden para avanzar sin bloqueos:

1. `src/main.jsx` (BrowserRouter + provider global).
2. `src/App.jsx` (definicion de rutas).
3. `src/services/api.js` (instancia Axios + token + interceptor 401).
4. `src/services/authService.js` y `src/services/productService.js`.
5. `src/context/AuthContext.jsx` y `src/context/authContext.js`.
6. `src/hooks/useAuth.js`.
7. `src/utils/ProtectedRoute.jsx`.
8. `src/hooks/useProducts.js`.
9. Paginas: `src/pages/LoginPage.jsx`, `src/pages/RegisterPage.jsx`, `src/pages/ProductsPage.jsx`.
10. Componentes UI: `Navbar`, `ProductForm`, `Pagination`, `LoadingSpinner`, `ErrorAlert`, `ConfirmModal`.
11. Estilos `*.module.css` y `src/styles/global.css`.

## 5. Ejecutar proyecto

```bash
cd step_2/frontend
npm install
npm run dev
```

## 6. Flujo de prueba sugerido

1. Inicia backend Step 1.
2. Abre frontend en `http://localhost:5173`.
3. Crea cuenta nueva en Register.
4. Inicia sesion en Login.
5. Crea producto desde el dashboard.
6. Edita y elimina producto.
7. Cierra sesion y confirma que `/products` vuelve a `/login`.

## 7. Problemas comunes

1. Error CORS:
   - revisa `CORS_ORIGIN` del backend y `VITE_API_URL` del frontend.
2. Loop infinito de requests:
   - revisa dependencias de `useEffect` en `useProducts`.
3. 401 constante:
   - confirma que el token se guarda y se envia con `Bearer`.

## 8. Checklist antes de pasar a Step 3

1. Login y register funcionando.
2. Rutas protegidas funcionando.
3. CRUD de productos funcionando.
4. Mensajes de error y carga visibles.
5. `npm run build` y `npm run lint` sin errores.
