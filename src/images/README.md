# 📸 Carpeta de Imágenes - COMUNO

Esta carpeta contiene todas las imágenes de thumbnails para las películas, series y programas de TV de COMUNO.

## 📋 Imágenes requeridas actualmente:

Sube los siguientes archivos a esta carpeta:

### Películas Peruanas:
- `chavinThumbnail.png` - Thumbnail para "Chavín de Huantar"
- `elCorrecaminos.png` - Thumbnail para "El Correcaminos"
- `winaypacha.png` - Thumbnail para "Wiñaypacha"

### Series Peruanas:
- `misterioThumbnail.png` - Thumbnail para "Misterio"
- `pataclaun.png` - Thumbnail para "Pataclaun"
- `laGranSangre.png` - Thumbnail para "La Gran Sangre"

### TV Shows Peruanos:
- `alFondoThumbnail.png` - Thumbnail para "Al Fondo Hay Sitio"
- `yoSoy.png` - Thumbnail para "Yo Soy"

### Películas Internacionales:
- `elPadrino.png` - Thumbnail para "El Padrino"
- `scarface.png` - Thumbnail para "Scarface"
- `ironman.png` - Thumbnail para "Iron Man"
- `losIncreibles.png` - Thumbnail para "Los Increíbles"

### Series Internacionales:
- `breakingBad.png` - Thumbnail para "Breaking Bad"
- `theBoys.png` - Thumbnail para "The Boys"
- `avatar.png` - Thumbnail para "Avatar: La Leyenda de Aang"
- `theOffice.png` - Thumbnail para "The Office"

### TV Shows Internacionales:
- `alf.png` - Thumbnail para "ALF"
- `horaDeAventura.png` - Thumbnail para "Hora de Aventura"

## 🎨 Especificaciones técnicas:

- **Formato recomendado:** JPG o PNG
- **Dimensiones:** 1920x1080px (relación 16:9)
- **Peso máximo:** 500KB por imagen
- **Nombres:** Sin espacios, usar camelCase o guiones

## 📝 Cómo agregar nuevas imágenes:

1. Sube tu imagen a esta carpeta
2. Anota el nombre exacto del archivo
3. En `/App.tsx`, agrega la película usando:
   ```typescript
   thumbnail: `${GITHUB_IMAGES_BASE}nombreDelArchivo.jpg`
   ```

## ⚠️ Importante:

- Los nombres de archivo son **case-sensitive** (distinguen mayúsculas/minúsculas)
- Asegúrate de que el nombre en el código coincida exactamente con el archivo
- No uses espacios ni caracteres especiales en los nombres

## 🔗 URL de acceso:

Una vez subidas, tus imágenes estarán disponibles en:
```
https://raw.githubusercontent.com/TU-USUARIO/TU-REPO/main/images/nombreDelArchivo.jpg
```

Recuerda actualizar `GITHUB_IMAGES_BASE` en `/App.tsx` con tu usuario y repositorio real.