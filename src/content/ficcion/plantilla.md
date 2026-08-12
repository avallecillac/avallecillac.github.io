---
# ---- Obligatorios ----------------------------------------------------
title: "Plantilla — copia este archivo para empezar una entrada"
date: 2026-08-12
# El fragmento que se ve en Google, en los listados y en el RSS.
# Obligatorio salvo que la entrada sea borrador. Entre 120 y 158 caracteres.
description: "Plantilla con todos los campos disponibles al escribir una entrada, explicados uno por uno. No se publica."

# ---- Opcionales ------------------------------------------------------
# Borrador: se ve en `npm run dev`, nunca en el sitio publicado.
draft: true

# Idioma. En ficcion/ es `es` por defecto; ponlo solo si escribes en inglés.
lang: es

# Etiquetas. También sirven para calcular las entradas relacionadas.
tags: ["plantilla"]

# Fecha de revisión, si vuelves sobre una entrada ya publicada.
# Se muestra junto a la fecha original y actualiza `dateModified` para buscadores.
# updated: 2026-09-01

# Puntos clave: de tres a cinco frases que se sostengan solas.
# Se muestran en un recuadro bajo el título y se envían como datos
# estructurados. Es lo que un buscador con IA cita textualmente.
# Sáltatelo en ficción: un resumen en viñetas encima de un relato lo estropea.
# takeaways:
#   - "Cada frase debe entenderse fuera de contexto, nombrando el sujeto en vez de decir «esto» o «lo anterior»."
#   - "Tres a cinco bastan. Más se leen como un índice, no como un resumen."

# Traducciones: dos entradas que compartan `translationKey` se declaran
# mutuamente con hreflang, para que Google no las trate como duplicados.
# translationKey: "la-casa-vacia"

# Imagen para redes sociales. Por defecto se usa /og.png.
# ogImage: "/images/mi-portada.png"

# Deja la página accesible pero fuera de los buscadores y de llms.txt.
# noindex: true
---

Este archivo existe por dos razones:

1. Sirve de plantilla — copia el frontmatter de arriba, borra lo que no necesites y empieza
   a escribir. Solo `title`, `date` y `description` son obligatorios.
2. Mantiene la colección `ficcion` con al menos un archivo, que es lo que Astro necesita para
   no quejarse mientras la sección está vacía. Borra esta plantilla cuando ya tengas dos o
   tres entradas de verdad.

Como tiene `draft: true`, aparece en `npm run dev` pero **nunca** en el sitio publicado.

## Dónde va cada cosa

El nombre del archivo es la URL: `src/content/ficcion/la-casa-vacia.md` se publica en
`nazayuwe.com/ficcion/la-casa-vacia/`. En minúsculas y con guiones, sin fechas ni espacios.

Las imágenes van en `src/assets/images/<tema>/` y se enlazan con ruta relativa:

```markdown
![Describe lo que se ve en la imagen](../../assets/images/tema/foto.jpg)
```

Así se convierten a WebP y se les añaden dimensiones y carga diferida. Escribe siempre un texto
alternativo real: es lo que lee un lector de pantalla y lo que aparece si la imagen falla.
