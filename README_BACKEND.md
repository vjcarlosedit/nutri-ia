# Backend Nutri-IA

Backend completo con Express, SQLite e integración de DeepSeek AI.

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   cd server
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` y configura:
   - `DEEPSEEK_API_KEY`: Tu API key de DeepSeek (obtén una en https://platform.deepseek.com/)
   - `JWT_SECRET`: Una clave secreta para JWT (cambia en producción)
   - `PORT`: Puerto del servidor (default: 3001)

3. **Inicializar base de datos:**
   ```bash
   npm run init-db
   ```
   
   Esto creará:
   - La base de datos SQLite
   - Las tablas necesarias
   - Un usuario de prueba: `admin@nutriia.com` / `admin123`

## 🏃 Ejecutar

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3001`

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Evaluaciones
- `GET /api/evaluations` - Obtener todas las evaluaciones
- `GET /api/evaluations/patient/:patientName` - Evaluaciones por paciente
- `POST /api/evaluations` - Crear evaluación
- `GET /api/evaluations/stats` - Obtener estadísticas

### Planes Alimenticios
- `GET /api/meal-plans` - Obtener todos los planes
- `GET /api/meal-plans/patient/:patientName` - Planes por paciente
- `POST /api/meal-plans/generate` - Generar plan con IA (DeepSeek)
- `POST /api/meal-plans` - Crear plan manualmente

### Monitoreo
- `GET /api/monitoring` - Obtener registros de monitoreo
- `POST /api/monitoring/analyze` - Generar análisis con IA
- `POST /api/monitoring/tracking` - Guardar tracking
- `GET /api/monitoring/patients` - Obtener lista de pacientes

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/*`) requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro y se guarda automáticamente.

## 🤖 Integración DeepSeek

El backend usa DeepSeek para:
- **Generar planes alimenticios personalizados** basados en evaluaciones nutricionales
- **Analizar monitoreo** y generar recomendaciones inteligentes

Para obtener una API key:
1. Ve a https://platform.deepseek.com/
2. Crea una cuenta
3. Genera una API key
4. Agrégala a tu `.env`

## 📊 Base de Datos

La base de datos SQLite se guarda en `server/database/nutriia.db`

**Tablas:**
- `users` - Usuarios del sistema
- `evaluations` - Evaluaciones nutricionales
- `meal_plans` - Planes alimenticios
- `monitoring_records` - Registros de análisis de monitoreo
- `tracking` - Seguimiento de pacientes

## 🔧 Desarrollo

**Estructura del proyecto:**
```
server/
├── config/
│   └── database.js      # Configuración de SQLite
├── database/
│   ├── schema.sql       # Esquema de la base de datos
│   └── nutriia.db       # Base de datos (generada)
├── middleware/
│   └── auth.js          # Middleware de autenticación
├── routes/
│   ├── auth.js          # Rutas de autenticación
│   ├── evaluations.js   # Rutas de evaluaciones
│   ├── mealPlans.js     # Rutas de planes alimenticios
│   └── monitoring.js    # Rutas de monitoreo
├── scripts/
│   └── init-db.js       # Script de inicialización
├── services/
│   └── deepseek.js      # Servicio de integración con DeepSeek
└── server.js            # Servidor principal
```

## ⚠️ Notas

- En producción, cambia `JWT_SECRET` por una clave segura
- La base de datos SQLite es adecuada para desarrollo y pequeñas aplicaciones
- Para producción, considera migrar a PostgreSQL o MySQL
- Asegúrate de hacer backup de la base de datos regularmente

