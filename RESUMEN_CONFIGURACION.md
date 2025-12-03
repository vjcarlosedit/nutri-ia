# 📱 Resumen Rápido: Configuración de Nombre e Icono

## 🎯 Dónde Configurar el Nombre de la Aplicación

### Archivo Principal: `capacitor.config.ts`

```3:3:capacitor.config.ts
  appName: 'Nutri-IA Expert',
```

**📍 Ubicación:** `capacitor.config.ts` - Línea 3

**Cambia:** `'Nutri-IA Expert'` por el nombre que desees mostrar en el dispositivo.

---

## 🎨 Dónde Configurar el Icono

### Ubicación de los Iconos en Android

Los iconos se colocan en estas carpetas (después de ejecutar `npx cap add android`):

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png      (48x48 px)
├── mipmap-hdpi/ic_launcher.png      (72x72 px)
├── mipmap-xhdpi/ic_launcher.png     (96x96 px)
├── mipmap-xxhdpi/ic_launcher.png    (144x144 px)
└── mipmap-xxxhdpi/ic_launcher.png   (192x192 px)
```

**📝 Nota:** Necesitas un icono de 1024x1024 px como base. Puedes usar herramientas online para generar todos los tamaños automáticamente.

---

## 🚀 Pasos Rápidos para Generar el APK

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Agregar plataforma Android:**
   ```bash
   npx cap add android
   ```

3. **Construir la app:**
   ```bash
   npm run build
   ```

4. **Sincronizar con Capacitor:**
   ```bash
   npm run cap:sync
   ```

5. **Abrir en Android Studio:**
   ```bash
   npm run cap:open android
   ```

6. **En Android Studio:** Build → Build Bundle(s) / APK(s) → Build APK(s)

---

## 📂 Archivos Clave del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `capacitor.config.ts` | ⭐ **AQUÍ** configuras el nombre (`appName`) |
| `android/app/src/main/res/mipmap-*/ic_launcher.png` | ⭐ **AQUÍ** colocas los iconos |
| `android/app/src/main/res/values/strings.xml` | Nombre alternativo en Android |
| `package.json` | Scripts y dependencias |

---

Para más detalles, consulta `CONFIGURACION_APK.md`

