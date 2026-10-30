# 📦 TAGHER'S - Documentación Oficial del Proyecto

Bienvenido a la documentación central de **TAGHER'S**, la plataforma web de comercio electrónico y moda urbana (streetwear) inspirada en la estética gráfica de Figma, con arquitectura lista para producción, probador virtual en tiempo real potenciado por Inteligencia Artificial y base de datos relacional.

---

## 🎯 Objetivo del Proyecto

El objetivo de este proyecto es doble:
1. **Tienda Online Insignia**: Servir como una tienda de ropa urbana de alto impacto visual (baggy jeans, graphic tees, hoodies y accesorios de estética skate/90s/Y2K).
2. **Producto Comercializable (SaaS / White-Label)**: Una solución lista para ser vendida o licenciada a dueños de marcas de ropa, tiendas independientes y showrooms que deseen diferenciarse de la competencia mediante:
   - **Probador Virtual con Cámara (AR & IA)** que reduce devoluciones y aumenta la tasa de conversión.
   - **Catálogo interactivo con carruseles multi-ángulo**.
   - **Flujo de compra optimizado y sistema de fidelización de usuarios**.

---

## 🧭 Índice de la Documentación

Hemos organizado la documentación en módulos específicos dentro de esta carpeta `/doc`:

1. [📐 Arquitectura del Sistema y Base de Datos](file:///c:/Users/User/Documents/ROPA/doc/ARQUITECTURA_Y_BASE_DE_DATOS.md)
   - Explicación de las tablas relacionales (`users`, `products`, `orders`, etc.).
   - Estructura de la API REST del backend (`server.js`).
   - Guía paso a paso para conectar a **Supabase (PostgreSQL en la nube)**, **MySQL** o **SQLite**.
2. [🤖 Probador Virtual e Inteligencia Artificial](file:///c:/Users/User/Documents/ROPA/doc/PROBADOR_VIRTUAL_E_IA.md)
   - Cómo funciona la detección corporal en tiempo real con **Google MediaPipe Pose**.
   - Opciones y comparativa de APIs de IA Generativa fotorealista (Fashn.ai, Replicate IDM-VTON).
   - Guía de implementación y costos.
3. [👕 Catálogo de Prendas y Carrusel de Imágenes](file:///c:/Users/User/Documents/ROPA/doc/CATALOGO_Y_CARRUSEL.md)
   - Estructura de datos multi-imagen (frente, dorso, puesta en modelo, detalle textil).
   - Cómo dar de alta nuevas prendas y accesorios en el catálogo.
4. [🚀 Roadmap de Ideas y Estrategias Comerciales](file:///c:/Users/User/Documents/ROPA/doc/IDEAS_Y_ROADMAP_FUTURO.md)
   - Nuevas ideas recomendadas para vender el software a clientes.
   - Integración con WhatsApp Bot, probador 3D (Three.js), sistema de dropshipping y más.

---

## ⚡ Guía Rápida de Inicio Local

### Requisitos Previos
- Node.js versión 18 o superior instalado en el equipo.

### Ejecución
1. Abre tu terminal en la raíz del proyecto (`c:\Users\User\Documents\ROPA`).
2. Inicia el servidor local:
   ```bash
   npm start
   ```
3. Accede desde tu navegador a:
   ```
   http://localhost:3000
   ```

También puedes abrir directamente [index.html](file:///c:/Users/User/Documents/ROPA/index.html) sin necesidad de servidor, gracias a la arquitectura desacoplada de la interfaz.
