# 📱 Preparar Proyecto para Appflow

## ✅ Checklist antes de hacer build en Appflow

### 1. Verificar que todo esté en Git

```bash
# Verificar estado
git status

# Agregar todos los archivos nuevos
git add .

# Commit de cambios
git commit -m "Backend completo con SQLite y DeepSeek AI"

# Push a GitHub
git push origin main
```

### 2. Archivos importantes que deben estar en Git

- ✅ `server/` - Todo el backend
- ✅ `server/.env.example` - Ejemplo de configuración (sin datos sensibles)
- ✅ `capacitor.config.ts` - Configuración de Capacitor
- ✅ `package.json` - Dependencias del frontend
- ✅ `src/` - Código fuente del frontend
- ✅ `.github/workflows/build-apk.yml` - Workflow de GitHub Actions (opcional)

### 3. Archivos que NO deben estar en Git

- ❌ `server/.env` - Contiene API keys (agregar a .gitignore)
- ❌ `server/data/` - Base de datos local
- ❌ `node_modules/` - Dependencias
- ❌ `build/` - Build del frontend

### 4. Verificar .gitignore

Asegúrate de que `.gitignore` incluya:

```
# Backend
server/.env
server/data/
server/node_modules/
server/dist/

# Frontend
node_modules/
build/
dist/

# Capacitor
android/
ios/
.capacitor/
```

### 5. Variables de Entorno en Appflow

En Ionic Appflow, necesitarás configurar estas variables de entorno:

1. Ve a tu app en https://dashboard.ionic.io/
2. Settings → Environment Variables
3. Agrega:
   - `DEEPSEEK_API_KEY` - Tu API key de DeepSeek
   - `JWT_SECRET` - Secreto para JWT (genera uno seguro)
   - `DB_PATH` - Ruta de la base de datos (default: `./data/nutriia.db`)

### 6. Configuración del Build en Appflow

1. **Platform**: Android
2. **Build Type**: Debug (para pruebas) o Release (para producción)
3. **Environment**: Selecciona el environment con las variables configuradas
4. **Native Config**: No necesario por ahora

### 7. Notas Importantes

- ⚠️ El backend NO se ejecuta en el APK. El APK es solo el frontend.
- ⚠️ Necesitarás un servidor backend separado (no incluido en el APK)
- ⚠️ El frontend se conecta al backend mediante la URL configurada en `VITE_API_URL`

### 8. Para Producción

Si quieres incluir el backend en el APK, necesitarías:
- Usar Capacitor HTTP plugin para hacer requests locales
- O configurar un servidor backend en la nube (Heroku, Railway, etc.)

### 9. Verificar antes de Build

```bash
# 1. Build del frontend funciona
npm run build

# 2. No hay errores de TypeScript
cd server
npm run build

# 3. Todo está commiteado
git status
```

### 10. Crear Build en Appflow

1. Ve a https://dashboard.ionic.io/
2. Selecciona tu app "Nutri-IA"
3. Builds → New Build
4. Selecciona el commit más reciente
5. Platform: Android
6. Build Type: Debug
7. Start Build

¡Listo! 🚀

