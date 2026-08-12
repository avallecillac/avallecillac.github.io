---
title: "Plantilla — borra este archivo cuando publiques el primero"
date: 2026-08-12
description: "Ejemplo de cómo se escribe una entrada. No se publica: draft es true."
draft: true
---

Este archivo existe por dos razones:

1. Sirve de plantilla — copia el frontmatter de arriba y empieza a escribir.
2. Mantiene la colección `ficcion` con al menos un archivo, que es lo que Astro necesita
   para no quejarse mientras la sección está vacía.

Como tiene `draft: true`, aparece en `npm run dev` pero **nunca** en el sitio publicado.
Bórralo en cuanto tengas la primera entrada de verdad.

El nombre del archivo es la URL: `src/content/ficcion/la-casa-vacia.md` se publica en
`nazayuwe.com/ficcion/la-casa-vacia/`.
