# Guía de Configuración para Generar APK

Esta guía te explica cómo configurar el nombre de la aplicación y el icono para generar el APK.

## ⚠️ ¿No tienes Android Studio?

Si no tienes Android Studio instalado, consulta **`BUILD_SIN_ANDROID_STUDIO.md`** para ver alternativas:
- ✅ **Ionic Appflow** (similar a EAS, build en la nube)
- ✅ **GitHub Actions** (gratis, automático)
- ✅ **Docker** (build local sin instalar Android Studio)

**Nota:** EAS CLI solo funciona con proyectos Expo. Tu proyecto es React con Vite, por lo que necesitas usar Capacitor con una de las alternativas mencionadas.

## 📱 Configuración del Nombre de la Aplicación

### Opción 1: Archivo `capacitor.config.ts` (Recomendado)

El nombre de la aplicación se configura en el archivo `capacitor.config.ts`:

```typescript
appName: 'Nutri-IA Expert',  // Cambia este valor por el nombre que desees
```

**Ubicación:** `capacitor.config.ts` (línea 5)

### Opción 2: Archivo de Android `strings.xml`

También puedes configurarlo directamente en Android:

**Ubicación:** `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">Nutri-IA Expert</string>
</resources>
```

**Nota:** Después de cambiar el nombre, ejecuta:
```bash
npm run cap:sync
```

---

## 🎨 Configuración del Icono de la Aplicación

### Paso 1: Preparar el Icono

Necesitas un icono en formato PNG con las siguientes características:
- **Tamaño recomendado:** 1024x1024 píxeles
- **Formato:** PNG con fondo transparente (opcional)
- **Calidad:** Alta resolución

### Paso 2: Generar los Iconos para Android

Puedes usar una herramienta online como:
- [App Icon Generator](https://www.appicon.co/)
- [Icon Kitchen](https://icon.kitchen/)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

O usar el plugin de Capacitor:

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#000000'
```

### Paso 3: Ubicación de los Iconos

Los iconos de Android se colocan en:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
├── mipmap-xxxhdpi/
│   └── ic_launcher.png (192x192)
└── mipmap-anydpi-v26/
    └── ic_launcher.xml (icono adaptativo)
```

### Paso 4: Reemplazar los Iconos

1. Coloca tu icono principal (1024x1024) en la raíz del proyecto como `icon.png`
2. Ejecuta el generador de assets de Capacitor (ver Paso 2)
3. O manualmente reemplaza los archivos en cada carpeta `mipmap-*`

---

## 🚀 Pasos para Generar el APK

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Construir la Aplicación Web

```bash
npm run build
```

### 3. Sincronizar con Capacitor

```bash
npm run cap:sync
```

### 4. Abrir Android Studio

```bash
npm run cap:open android
```

O manualmente:
```bash
npx cap open android
```

### 5. Generar el APK en Android Studio

1. Abre Android Studio
2. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Espera a que termine la compilación
4. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Generar APK Firmado (Para Producción)

1. En Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Crea un keystore si no tienes uno
4. Sigue el asistente
5. El APK firmado estará en: `android/app/release/app-release.apk`

---

## 📝 Resumen de Archivos Importantes

| Archivo | Propósito | Dónde Configurar |
|---------|-----------|------------------|
| `capacitor.config.ts` | Configuración principal de Capacitor | Nombre de la app (`appName`), ID (`appId`) |
| `android/app/src/main/res/values/strings.xml` | Strings de Android | Nombre de la app en Android |
| `android/app/src/main/res/mipmap-*/ic_launcher.png` | Iconos de la app | Reemplazar con tu icono |
| `android/app/build.gradle` | Configuración de build | Versión, package name, etc. |

---

## ⚙️ Configuración Adicional

### Cambiar el ID de la Aplicación (Package Name)

En `capacitor.config.ts`:
```typescript
appId: 'com.nutriia.expert',  // Cambia esto por tu package name único
```

También debes actualizarlo en:
- `android/app/build.gradle` (línea `applicationId`)
- `android/app/src/main/AndroidManifest.xml` (si es necesario)

### Cambiar la Versión

En `package.json`:
```json
"version": "0.1.0"
```

Y en `android/app/build.gradle`:
```gradle
versionCode 1
versionName "0.1.0"
```

---

## 🔧 Comandos Útiles

```bash
# Construir y sincronizar
npm run build && npm run cap:sync

# Abrir Android Studio
npm run cap:open android

# Sincronizar cambios
npm run cap:sync

# Ver logs de Android
npx cap run android
```

---

## ❓ Solución de Problemas

### El icono no aparece
- Asegúrate de haber ejecutado `npm run cap:sync` después de cambiar los iconos
- Verifica que los archivos estén en las carpetas correctas
- Limpia el proyecto en Android Studio: **Build** → **Clean Project**

### El nombre no cambia
- Verifica tanto `capacitor.config.ts` como `strings.xml`
- Ejecuta `npm run cap:sync`
- Limpia y reconstruye el proyecto en Android Studio

### Errores de compilación
- Asegúrate de tener Android SDK instalado
- Verifica que Java JDK esté configurado correctamente
- Revisa los logs en Android Studio

