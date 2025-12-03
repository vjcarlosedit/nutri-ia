# ⚡ Guía Rápida: Generar APK sin Android Studio

## 🎯 Opción Recomendada: Ionic Appflow (Similar a EAS)

### Pasos:

```bash
# 1. Instalar Ionic CLI
npm install -g @ionic/cli

# 2. Iniciar sesión (crea cuenta gratuita en https://ionic.io/)
ionic login

# 3. Inicializar en tu proyecto
ionic init

# 4. Conectar con Appflow
ionic link
```

Luego ve a https://dashboard.ionic.io/ y crea un build de Android desde la interfaz web.

---

## 🆓 Alternativa Gratis: GitHub Actions

Si tu proyecto está en GitHub, ya está configurado. Solo necesitas:

1. **Hacer push a GitHub:**
   ```bash
   git add .
   git commit -m "Add build workflow"
   git push
   ```

2. **Descargar el APK:**
   - Ve a tu repositorio → "Actions"
   - Selecciona el workflow que se ejecutó
   - Descarga el APK del artifact

El workflow ya está configurado en `.github/workflows/build-apk.yml`

---

## 📝 Configuración del Nombre e Icono

### Nombre:
**Archivo:** `capacitor.config.ts` (línea 3)
```typescript
appName: 'Nutri-IA Expert',  // Cambia esto
```

### Icono:
**Ubicación:** `android/app/src/main/res/mipmap-*/ic_launcher.png`

Necesitas un icono de 1024x1024px. Usa herramientas como:
- https://www.appicon.co/
- https://icon.kitchen/

---

## ❓ ¿Por qué no funciona EAS?

EAS CLI es **solo para proyectos Expo/React Native**. Tu proyecto es **React con Vite**, por eso necesitas usar **Capacitor** con una de las alternativas mencionadas.

---

Para más detalles, consulta `BUILD_SIN_ANDROID_STUDIO.md`

