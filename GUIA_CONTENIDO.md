# Guia rapida para actualizar la pagina

Esta pagina esta hecha en React para GitHub Pages, pero sin backend. Eso significa que la forma mas facil de actualizar el contenido es editar un solo archivo:

- `src/data/content.js`

## Donde cambiar cada cosa

- Nombre de la pagina, frase principal y fecha del noviazgo:
  - Busca `brand`, `homeTitle`, `homeSubtitle`, `relationshipStart` y `relationshipLabel`.
- Secciones de la pagina principal:
  - Edita el arreglo `sections`.
- Informacion de Maria y Juanjo:
  - Edita el arreglo `people`.
- Mascotas:
  - Edita el arreglo `pets`.
- Recuerdos:
  - Edita el arreglo `memories`.
- Lugares visitados y pendientes:
  - Edita `places.visited` y `places.wishlist`.
- Fechas importantes:
  - Edita el arreglo `timeline`.
- Cartas:
  - Edita el arreglo `letters`.
- Playlist:
  - Edita el arreglo `playlist`.
- Suenos:
  - Edita el arreglo `dreams`.
- Frases:
  - Edita el arreglo `quotes`.
- Proximamente:
  - Edita el arreglo `upcoming`.

## Como anadir un recuerdo nuevo

Dentro de `memories`, agrega un nuevo objeto siguiendo esta estructura:

```js
{
  slug: "nombre-corto-unico",
  title: "Titulo del recuerdo",
  date: "2026-04-09",
  displayDate: "9 de abril de 2026",
  summary: "Resumen corto",
  cover: "./ruta/a/la/imagen-principal.jpg",
  images: [
    "./ruta/a/la/imagen-1.jpg",
    "./ruta/a/la/imagen-2.jpg"
  ],
  tags: ["Viaje", "Cita", "Especial"],
  body: [
    "Parrafo 1",
    "Parrafo 2"
  ]
}
```

## Como anadir una cancion de Spotify

Dentro de `playlist`, agrega o modifica un objeto asi:

```js
{
  title: "Nombre de la cancion o playlist",
  note: "Por que es especial",
  spotifyUrl: "https://open.spotify.com/..."
}
```

## Como anadir imagenes

- Guarda las imagenes dentro de una carpeta del proyecto.
- Puedes reutilizar `assets/imgs/` o crear carpetas nuevas como `assets/memories/`.
- Luego usa la ruta relativa en `content.js`.

## Idea recomendada para el futuro

Si despues quieres que Maria Isabel agregue recuerdos sin tocar el codigo, la mejor siguiente fase es esta:

1. Crear un formulario.
2. Guardar respuestas en Google Sheets, Airtable o Notion.
3. Hacer que la pagina lea ese contenido como fuente externa.

Eso sigue sin requerir backend propio, pero ya seria una segunda etapa.
