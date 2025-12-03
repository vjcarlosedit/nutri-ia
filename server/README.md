# Nutri-IA Backend

Backend API para la aplicación Nutri-IA Expert con SQLite y DeepSeek AI.

## Características

- ✅ Autenticación con JWT
- ✅ Base de datos SQLite
- ✅ Integración con DeepSeek AI para generar planes alimenticios
- ✅ API RESTful completa
- ✅ Análisis de monitoreo con IA

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y configura:
- `JWT_SECRET`: Secreto para JWT (cambiar en producción)
- `DEEPSEEK_API_KEY`: Tu API key de DeepSeek
- `PORT`: Puerto del servidor (default: 3001)

3. Inicializar base de datos:
```bash
npm run dev
```

La base de datos se creará automáticamente en `data/nutriia.db`.

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Evaluaciones
- `GET /api/evaluations` - Obtener todas las evaluaciones
- `GET /api/evaluations/patient/:patientName` - Evaluaciones por paciente
- `POST /api/evaluations` - Crear evaluación
- `GET /api/evaluations/stats` - Estadísticas

### Planes Alimenticios
- `GET /api/meal-plans` - Obtener todos los planes
- `GET /api/meal-plans/patient/:patientName` - Planes por paciente
- `POST /api/meal-plans/generate` - Generar plan con IA
- `POST /api/meal-plans` - Crear plan manual

### Monitoreo
- `GET /api/monitoring` - Obtener registros
- `GET /api/monitoring/patients` - Lista de pacientes
- `POST /api/monitoring/analyze` - Analizar paciente con IA
- `POST /api/monitoring/tracking` - Guardar seguimiento

## DeepSeek AI

Para usar DeepSeek AI:
1. Obtén tu API key en https://platform.deepseek.com/
2. Configúrala en `.env` como `DEEPSEEK_API_KEY`
3. Los planes alimenticios se generarán automáticamente usando IA

## Base de Datos

La base de datos SQLite se crea automáticamente. Estructura:
- `users` - Usuarios del sistema
- `patients` - Pacientes
- `evaluations` - Evaluaciones nutricionales
- `meal_plans` - Planes alimenticios
- `monitoring` - Registros de monitoreo
