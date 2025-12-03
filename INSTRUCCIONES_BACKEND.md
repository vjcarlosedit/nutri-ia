# 🚀 Instrucciones para Configurar el Backend

## 📋 Pasos para Iniciar el Backend

### 1. Instalar Dependencias del Backend

```bash
cd server
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo:

```bash
# En Windows PowerShell
Copy-Item env.example.txt .env

# O crea manualmente el archivo .env con:
```

Contenido del archivo `.env`:
```
PORT=3001
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
DEEPSEEK_API_KEY=tu_api_key_de_deepseek
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DB_PATH=./data/nutriia.db
```

**⚠️ IMPORTANTE:**
- Cambia `JWT_SECRET` por un secreto seguro
- Obtén tu API key de DeepSeek en: https://platform.deepseek.com/
- Configura `DEEPSEEK_API_KEY` con tu clave

### 3. Iniciar el Servidor

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3001`

### 4. Configurar el Frontend

Asegúrate de que el frontend apunte al backend. El archivo `src/services/api.ts` ya está configurado para usar:
- `http://localhost:3001/api` (por defecto)
- O la variable de entorno `VITE_API_URL`

## 🔑 Obtener API Key de DeepSeek

1. Ve a https://platform.deepseek.com/
2. Crea una cuenta o inicia sesión
3. Ve a la sección de API Keys
4. Crea una nueva API key
5. Cópiala y pégala en el archivo `.env` como `DEEPSEEK_API_KEY`

## 📊 Estructura de la Base de Datos

La base de datos SQLite se crea automáticamente en `server/data/nutriia.db` con las siguientes tablas:

- **users**: Usuarios del sistema
- **patients**: Pacientes
- **evaluations**: Evaluaciones nutricionales
- **meal_plans**: Planes alimenticios (generados con IA)
- **monitoring**: Registros de monitoreo

## 🧪 Probar la API

### Registro de Usuario
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

## 🔄 Cambios Realizados

### Frontend Actualizado:
- ✅ `App.tsx` - Usa APIs para login/register/logout
- ✅ `src/services/api.ts` - Ya tenía las funciones definidas

### Componentes que Necesitan Actualización:
- ⚠️ `NutritionalEvaluation.tsx` - Actualizar para usar `evaluationsAPI.create()`
- ⚠️ `MealPlans.tsx` - Actualizar para usar `mealPlansAPI.generate()` y `mealPlansAPI.create()`
- ⚠️ `Monitoring.tsx` - Actualizar para usar `monitoringAPI.analyze()` y `monitoringAPI.saveTracking()`
- ⚠️ `EvaluationsList.tsx` - Actualizar para usar `evaluationsAPI.getAll()`
- ⚠️ `PatientsList.tsx` - Actualizar para usar `monitoringAPI.getPatients()`

## 📝 Notas

- El backend usa JWT para autenticación
- Los tokens expiran en 30 días
- La base de datos se crea automáticamente al iniciar
- Los planes alimenticios se generan usando DeepSeek AI
- El análisis de monitoreo también usa DeepSeek AI

## 🐛 Solución de Problemas

### Error: "DEEPSEEK_API_KEY no está configurada"
- Verifica que el archivo `.env` existe en la carpeta `server/`
- Verifica que `DEEPSEEK_API_KEY` tiene un valor válido

### Error: "Cannot find module"
- Ejecuta `npm install` en la carpeta `server/`

### Error de CORS
- El backend ya tiene CORS habilitado para todas las rutas
- Si persiste, verifica que el frontend esté en `http://localhost:3000`

