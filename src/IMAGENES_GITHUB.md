# 📸 Guía: Configurar Imágenes desde GitHub

Esta guía te explica cómo alojar las imágenes de las películas en tu repositorio de GitHub para tener control total y facilitar cambios.

## 🎯 Ventajas de usar GitHub para imágenes:
- ✅ Control total sobre las imágenes
- ✅ Fácil actualización (solo subir archivo nuevo)
- ✅ Gratis e ilimitado
- ✅ URLs estables que no cambian
- ✅ Funciona perfectamente en producción

## 📋 Paso 1: Preparar tu repositorio de GitHub

1. Ve a tu repositorio de COMUNO en GitHub
2. Crea una nueva carpeta llamada `images` en la raíz del repositorio
3. Dentro de la carpeta `images`, sube las siguientes imágenes:

### Imágenes requeridas actualmente:
```
images/
├── chavinThumbnail.png      (Película: Chavín de Huantar)
├── misterioThumbnail.png    (Serie: Misterio)
└── alFondoThumbnail.png     (TV Show: Al Fondo Hay Sitio)
```

## 📋 Paso 2: Obtener la URL base de GitHub

Tu URL base seguirá este formato:
```
https://raw.githubusercontent.com/TU-USUARIO/TU-REPOSITORIO/main/images/
```

**Ejemplo:**
Si tu usuario es `juanperez` y tu repo es `comuno-app`:
```
https://raw.githubusercontent.com/juanperez/comuno-app/main/images/
```

## 📋 Paso 3: Actualizar el código

Abre el archivo `/App.tsx` y en la línea 18, reemplaza:

```typescript
// ANTES:
const GITHUB_IMAGES_BASE = 'https://raw.githubusercontent.com/TU-USUARIO/TU-REPO/main/images/';

// DESPUÉS (con tus datos reales):
const GITHUB_IMAGES_BASE = 'https://raw.githubusercontent.com/juanperez/comuno-app/main/images/';
```

## 🎨 Paso 4: Agregar o cambiar imágenes

Para cambiar cualquier imagen:

1. **Opción A - Reemplazar imagen existente:**
   - Sube un nuevo archivo con el mismo nombre a la carpeta `images/`
   - GitHub automáticamente reemplazará la imagen
   - La app mostrará la nueva imagen sin cambiar código

2. **Opción B - Agregar nueva película/serie:**
   ```typescript
   {
     id: '16',
     title: 'Nueva Película',
     description: 'Descripción de la película',
     thumbnail: `${GITHUB_IMAGES_BASE}nuevaPelicula.jpg`,  // Solo cambia el nombre del archivo
     duration: '2h 10min',
     rating: 4.5,
     category: 'Película',
     isLocal: true,
     activeWatchParties: 0
   }
   ```

## 🔍 Paso 5: Verificar que funciona

Después de actualizar la URL base y subir las imágenes:

1. Espera 1-2 minutos (GitHub puede tardar en actualizar)
2. Prueba accediendo directamente a una imagen en el navegador:
   ```
   https://raw.githubusercontent.com/TU-USUARIO/TU-REPO/main/images/chavinThumbnail.png
   ```
3. Si la imagen se muestra, ¡está funcionando! ✅

## 💡 Consejos y mejores prácticas

### Formato de imágenes recomendado:
- **Formato:** JPG o PNG
- **Tamaño recomendado:** 1920x1080px (relación 16:9)
- **Peso:** Menos de 500KB para carga rápida
- **Nombres:** Sin espacios, usa guiones o camelCase

### Nombres de archivo sugeridos:
```
✅ BIEN:
- chavinThumbnail.png
- misterio-thumbnail.jpg
- al_fondo_hay_sitio.png

❌ MAL:
- Chavín de Huantar.png  (tiene espacios)
- película 1.jpg         (tiene espacios y caracteres especiales)
- IMG_1234.png          (nombre poco descriptivo)
```

## 🚀 Ejemplo completo

### Estructura de tu repo:
```
comuno-app/
├── images/
│   ├── chavinThumbnail.png
│   ├── misterioThumbnail.png
│   ├── alFondoThumbnail.png
│   ├── vocesDelBarrio.jpg       (nueva)
│   └── ritmosDelaTierra.jpg     (nueva)
├── components/
├── App.tsx
└── ...
```

### Código actualizado en App.tsx:
```typescript
const GITHUB_IMAGES_BASE = 'https://raw.githubusercontent.com/juanperez/comuno-app/main/images/';

const initialContents: Content[] = [
  {
    id: '1',
    title: 'Voces del Barrio',
    thumbnail: `${GITHUB_IMAGES_BASE}vocesDelBarrio.jpg`,  // Ahora desde GitHub
    // ... resto de propiedades
  },
  // ... más películas
];
```

## ⚠️ Solución de problemas

### Las imágenes no cargan:
1. **Verifica la URL:** Copia y pega la URL completa en el navegador
2. **Revisa el nombre:** Debe coincidir exactamente (case-sensitive)
3. **Espera caché:** GitHub puede tardar 1-2 minutos en actualizar
4. **Revisa la rama:** Asegúrate de usar `main` o `master` según tu repo

### Error 404:
- El archivo no existe o el nombre está mal escrito
- Verifica que subiste el archivo a la carpeta `images/`

### Imagen no se actualiza:
- GitHub puede cachear por unos minutos
- Prueba en modo incógnito del navegador
- Agrega `?v=2` al final de la URL para forzar actualización

## 🎯 Próximos pasos

Una vez configurado GitHub, puedes:
1. Cambiar cualquier imagen subiendo un nuevo archivo
2. Agregar más películas/series fácilmente
3. Organizar las imágenes en subcarpetas si lo deseas
4. Usar el mismo sistema para otros assets (logos, banners, etc.)

---

**¿Necesitas ayuda?** Si tienes problemas, verifica:
- ✅ Las imágenes están en la carpeta `images/` en la raíz
- ✅ Los nombres coinciden exactamente en el código
- ✅ La URL base está correcta en App.tsx
- ✅ Las imágenes se pueden ver directamente en el navegador
