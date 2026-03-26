# MERN Full Stack Authentication + CRUD (Guia por pasos)

Este repositorio esta pensado para estudiantes que quieren aprender a construir una app MERN completa desde cero, no solo clonar y ejecutar.

Aprenderas a construir:

1. Backend REST con autenticacion JWT y CRUD protegido.
2. Frontend React con login, rutas privadas y consumo de API.
3. Seguridad, testing, CI y deploy (Railway + Vercel).

## Como usar este repo

Este proyecto esta dividido en 3 pasos:

1. `step_1`: backend base.
2. `step_2`: frontend base.
3. `step_3`: endurecimiento final (seguridad + testing + CI + deploy).

La idea recomendada para estudiantes:

1. Abre el README del paso actual.
2. Escribe el codigo manualmente siguiendo el orden sugerido.
3. Ejecuta y prueba antes de pasar al siguiente paso.

Cada carpeta tiene instrucciones especificas y mas detalladas.

## Requisitos previos

- Node.js 20+
- npm 10+
- MongoDB local o MongoDB Atlas
- Git
- VS Code (opcional, recomendado)

## Ruta de aprendizaje sugerida

1. Step 1: crea API con Express + MongoDB + JWT.
2. Step 2: crea frontend con Vite + React + Router + Axios.
3. Step 3: agrega seguridad real, pruebas automatizadas, CI y despliegue.

## Ejecucion rapida (si quieres verificar cada etapa)

### Step 1

```bash
cd step_1/backend
npm install
npm run dev
```

### Step 2

```bash
cd step_2/frontend
npm install
npm run dev
```

### Step 3

```bash
cd step_3/backend
npm install
npm run dev
```

```bash
cd step_3/frontend
npm install
npm run dev
```

## Meta final del estudiante

Al terminar Step 3 deberias poder:

1. Registrar/login usuarios.
2. Crear/editar/eliminar productos con imagen.
3. Proteger rutas con JWT.
4. Ejecutar tests backend/frontend.
5. Tener CI en GitHub Actions.
6. Publicar backend en Railway y frontend en Vercel.
