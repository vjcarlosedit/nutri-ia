# 🚀 Generar APK sin Android Studio

Como tu proyecto es **React con Vite** (no Expo), EAS CLI no funcionará. Aquí tienes **3 alternativas** para generar el APK sin instalar Android Studio:

---

## ✅ Opción 1: Ionic Appflow (Recomendado - Similar a EAS)

Ionic Appflow es el servicio de build en la nube para proyectos Capacitor, similar a EAS pero para aplicaciones web convertidas a móvil.

### Pasos:

1. **Instalar Ionic CLI:**
   ```bash
   npm install -g @ionic/cli
   ```

2. **Iniciar sesión en Ionic:**
   ```bash
   ionic login
   ```
   (Crea una cuenta gratuita en https://ionic.io/ si no tienes una)

3. **Inicializar Appflow en tu proyecto:**
   ```bash
   ionic init
   ```

4. **Conectar con Appflow:**
   ```bash
   ionic link
   ```

5. **Configurar build para Android:**
   ```bash
   ionic build android --prod
   ```

6. **O usar el dashboard web:**
   - Ve a https://dashboard.ionic.io/
   - Crea un nuevo build
   - Selecciona Android
   - Descarga el APK cuando termine

**Ventajas:**
- ✅ No necesitas Android Studio
- ✅ Build en la nube
- ✅ Similar a EAS
- ✅ Plan gratuito disponible

---

## ✅ Opción 2: GitHub Actions (Gratis)

Puedes configurar GitHub Actions para compilar automáticamente el APK cada vez que hagas push.

### Pasos:

1. **Crear el archivo de workflow:**

Crea `.github/workflows/build-apk.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web app
      run: npm run build
    
    - name: Add Android platform
      run: npx cap add android
    
    - name: Sync Capacitor
      run: npx cap sync
    
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

2. **Hacer push a GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflow"
   git push
   ```

3. **Descargar el APK:**
   - Ve a tu repositorio en GitHub
   - Click en "Actions"
   - Selecciona el workflow que se ejecutó
   - Descarga el APK del artifact

**Ventajas:**
- ✅ Completamente gratis
- ✅ Automático
- ✅ No necesitas instalar nada localmente

---

## ✅ Opción 3: Capacitor con Build Remoto (Usando Docker)

Puedes usar un contenedor Docker con todas las herramientas necesarias.

### Pasos:

1. **Instalar Docker Desktop** (si no lo tienes)

2. **Crear un script de build:**

Crea `build-apk-docker.sh`:

```bash
#!/bin/bash
docker run --rm \
  -v "$PWD":/app \
  -w /app \
  -e ANDROID_HOME=/opt/android-sdk \
  reactnativecommunity/react-native-android \
  bash -c "npm install && npm run build && npx cap add android && npx cap sync && cd android && ./gradlew assembleDebug"
```

3. **Ejecutar:**
   ```bash
   chmod +x build-apk-docker.sh
   ./build-apk-docker.sh
   ```

**Ventajas:**
- ✅ No necesitas instalar Android Studio
- ✅ Todo en un contenedor

**Desventajas:**
- ⚠️ Requiere Docker
- ⚠️ Más complejo de configurar

---

## 🎯 Recomendación

**Para tu caso, recomiendo la Opción 1 (Ionic Appflow)** porque:
- Es la más similar a EAS
- No requiere configuración compleja
- Tiene interfaz web amigable
- Plan gratuito disponible

---

## 📝 Configuración del Nombre e Icono

Independientemente del método que elijas, el nombre y el icono se configuran igual:

### Nombre de la App:
**Archivo:** `capacitor.config.ts` (línea 3)
```typescript
appName: 'Nutri-IA Expert',
```

### Icono:
**Ubicación:** `android/app/src/main/res/mipmap-*/ic_launcher.png`

Después de ejecutar `npx cap add android`, reemplaza los iconos en las carpetas `mipmap-*`.

---

## 🚀 Pasos Rápidos con Ionic Appflow

```bash
# 1. Instalar Ionic CLI
npm install -g @ionic/cli

# 2. Iniciar sesión
ionic login

# 3. Inicializar
ionic init

# 4. Conectar con Appflow
ionic link

# 5. Build (esto se hace desde el dashboard web)
# O desde terminal:
ionic build android --prod
```

Luego ve a https://dashboard.ionic.io/ para descargar tu APK.

---

¿Quieres que configure alguna de estas opciones para ti?

