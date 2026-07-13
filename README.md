# Generador de Presupuestos

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Backend](https://img.shields.io/badge/Sin%20Backend-2EA44F?style=flat-square)

Cotizador de servicios web personalizable: una Single Page Application (SPA) que permite gestionar un catálogo local de servicios, alternar entre idiomas y monedas al instante, y generar documentos PDF limpios y profesionales directamente desde el navegador, sin depender de ningún backend.

## Características Principales

- **Catálogo de Servicios Editable:** 55 servicios organizados en 11 categorías (Frontend, Backend & API, Infraestructura, entre otras). El catálogo inicial se carga desde `productos.json`, pero se puede agregar, editar o eliminar todo desde la interfaz mediante el modal de Gestión del Catálogo.
- **Persistencia Automática:** los cambios al catálogo y los datos del emisor ("Mis Datos") se guardan en el `localStorage` del navegador (bajo la key `miCatalogoServicios`), así que nada se pierde al cerrar la pestaña o recargar la página.
- **Búsqueda Dinámica:** filtrado en tiempo real por nombre y categoría, pensado para manejar cómodamente un catálogo de 50+ ítems.
- **Bilingüe (Español / Inglés):** cada servicio incluye descripción en ambos idiomas (`descripcion.es` y `descripcion.en`), con el cambio de idioma controlado por un estado simple de React.
- **Multi-moneda (ARS / USD):** cada ítem del catálogo define su propio precio en ambas monedas (`precioBase` y `precioUSD`); el cambio de moneda solo actualiza el formato y qué campo se lee, sin hacer conversión automática por tasa de cambio.
- **Exportación a PDF sin dependencias:** el presupuesto se exporta usando `window.print()` del navegador, evitando librerías pesadas como jsPDF o react-pdf.
- **Modo Claro / Oscuro:** el esquema de colores respeta la preferencia del sistema operativo del usuario (`prefers-color-scheme: dark`).

## Tecnologías Utilizadas

- React (Hooks, estado principal en el componente `Presupuesto.jsx`)
- Vite (entorno de desarrollo y build)
- CSS3 nativo (Flexbox/Grid, `@media print`, `prefers-color-scheme`)
- Web Storage API (`localStorage`) para persistencia
- API de impresión nativa del navegador (`window.print()`) para exportar a PDF

## Cómo Generar el PDF

Al exportar, la aplicación usa la función nativa `window.print()` del navegador en lugar de una librería externa. Los elementos de la interfaz que no deben aparecer en el documento final (botones, controles de edición) están marcados con la clase `.no-print`, y las reglas definidas en `@media print` dentro de `Presupuesto.css` ajustan el layout para que se vea limpio tanto al imprimir en papel como al guardar como PDF desde el diálogo de impresión del navegador.

## Instalación y Ejecución Local

1. Clonar el repositorio:

```bash
git clone https://github.com/Bertolini-Victor/generador-presupuestos.git
cd generador-presupuestos
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir la URL que indique la terminal (habitualmente `http://localhost:5173`).

## Autor

**Victor H. Bertolini Agaras**

- **GitHub:** [@Bertolini-Victor](https://github.com/Bertolini-Victor)
- **LinkedIn:** [Victor Bertolini](https://www.linkedin.com/in/victor-bertolini)
