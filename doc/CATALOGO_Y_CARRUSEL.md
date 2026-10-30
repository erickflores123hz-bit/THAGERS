# 👕 Catálogo de Prendas y Carrusel de Imágenes

En las tiendas de ropa modernas, una sola foto no es suficiente para cerrar una venta. Los clientes necesitan ver el frente, la espalda, cómo cae la prenda sobre una persona en la calle y el detalle de la tela.

En este documento se explica cómo está estructurado el catálogo multi-imagen en **TAGHER'S** y cómo administrarlo.

---

## 📸 Estructura del Carrusel Multi-Ángulo

Cada producto en `app.js` (o en la tabla `product_images` de la base de datos) cuenta con un array `images` con 4 fotografías estratégicas:

| Índice | Tipo de Fotografía | Propósito Comercial |
|---|---|---|
| `[0]` | **Vista Frontal (Packshot)** | Muestra la prenda completa limpia sobre fondo neutro. Es la miniatura de portada. |
| `[1]` | **Vista Trasera (Back View)** | Esencial en streetwear para mostrar estampas de espalda, bolsillos de vaqueros o bordados en capucha. |
| `[2]` | **Foto en Modelo (Street / Outfit)** | Permite que el comprador entienda las proporciones reales (calce baggy, caída sobre la zapatilla, tiro). |
| `[3]` | **Detalle de Tejido (Close-up)** | Muestra la textura del algodón peinado (280gsm), remaches metálicos o costuras dobles. |

---

## 💻 Ejemplo de Objeto en `app.js`

```javascript
{
  id: 'vag-01',
  name: "Southpole 90s Vintage Baggy Denim",
  category: 'vaqueros',
  subCategory: 'denim',
  price: 75000,
  oldPrice: 89000,
  badge: 'SOUTHPOLE',
  // Array de imágenes para el carrusel
  images: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', // Frente
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', // Espalda
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', // Modelo outfit
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80'  // Detalle tela
  ],
  overlayImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80',
  overlayType: 'bottom',
  description: 'Vaqueros de corte ultra ancho inspirados en el skate y hip-hop de los años 90. Tejido denim de 14.5 oz con lavado stone-wash vintage y costuras reforzadas.',
  isOffer: true
}
```

---

## 🔄 Funcionamiento del Componente Carrusel

Cuando un usuario hace clic en cualquier tarjeta de producto, el modal ejecuta la función `openProductModal(productId)`:

1. **Montaje de Miniaturas**: Genera la barra inferior de miniaturas (`carousel-thumbnails`).
2. **Foto Principal Activa**: Muestra la primera imagen (`activeImageIndex = 0`).
3. **Navegación Fluida**:
   - Botón `‹` (Anterior) y `›` (Siguiente).
   - Clic directo en cualquiera de las 4 miniaturas para cambiar instantáneamente.
   - Atajos de teclado (flechas izquierda/derecha cuando el modal está abierto).
4. **Efecto de Transición**: Suave desvanecimiento (`fade-in`) y animación de borde activo en la miniatura seleccionada.

---

## ➕ Cómo Añadir Nuevas Prendas al Catálogo

Para agregar un producto nuevo a la tienda, solo debes añadir un objeto al array `PRODUCTS_DATABASE` en `app.js` (o hacer un `INSERT` en tu tabla `products` y `product_images`):

```sql
-- Ejemplo en SQL:
INSERT INTO products (id, name, category, sub_category, price, badge, description, overlay_type)
VALUES ('tee-04', 'Cyber Punk Acid Oversize', 'camisetas', 'graphic', 42000, 'NUEVO DROP', 'Algodón pesado 320gsm', 'top');

INSERT INTO product_images (product_id, image_url, view_angle, is_primary, sort_order)
VALUES 
  ('tee-04', 'https://mi-servidor.com/tee4-front.jpg', 'front', true, 1),
  ('tee-04', 'https://mi-servidor.com/tee4-back.jpg', 'back', false, 2),
  ('tee-04', 'https://mi-servidor.com/tee4-model.jpg', 'model', false, 3),
  ('tee-04', 'https://mi-servidor.com/tee4-detail.jpg', 'detail', false, 4);
```
