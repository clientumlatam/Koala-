# Respuestas a Consultas de Milton sobre la Tienda Web ("Koalas")

**Especificación Técnica y Comercial de los 6 Puntos Operativos**  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*  
*Interlocutor: Milton*  
*Equipo Técnico: Clientum E-Commerce & Arquitectura Digital*  
*Fecha: Septiembre 2026*

---

## 1. Actualización del Stock en la Página

* **Mecanismo Operativo:**  
  El stock disponible en la tienda online se actualiza de forma automática e inmediata en la base de datos central en el momento exacto en que un cliente finaliza y confirma su compra por la web.
* **Ventas Físicas / Mostrador:**  
  Si el negocio cuenta con puntos de venta físicos (General Roca o Neuquén Capital) o canales externos, la conexión por API y Webhooks entre el sistema de gestión del depósito (ERP) y la web envía el aviso de descuento de inventario para mantener el stock unificado y prevenir sobreventas.
* **Nota Técnica de Implementación:**  
  El descuento ante compras web es instantáneo (cero segundos de latencia). La velocidad del reflejo de ventas físicas depende de la arquitectura del ERP: si el ERP emite webhooks ante cada factura física, el impacto web es en tiempo real; si funciona por consultas periódicas (batch), se sincroniza cada pocos minutos.

---

## 2. Impacto del Ingreso de Mercadería al Stock

* **Mecanismo Operativo:**  
  El impacto es inmediato tan pronto como el personal de depósito o compras registra formalmente la entrada de mercadería (cargando cantidades, importando el remito del proveedor o escaneando el código de barras/QR de los bultos).
* **Reactivación Automática de Productos:**  
  Aquellos artículos que figuraban con la leyenda "Agotado" o "Sin stock" en la tienda online vuelven a mostrarse automáticamente disponibles para la venta con sus precios actualizados, sin que el administrador deba entrar a la web a activarlos de manera manual.

---

## 3. Cálculo del Costo de Flete y Entregas sin Cargo

### A. Cálculo del Costo de Flete
* **Operadores Logísticos Integrados:**  
  Mediante pasarelas logísticas (Andreani, Correo Argentino, OCA u otros operadores de paquetería regional), el cliente ingresa su **Código Postal** en el carrito y el sistema cotiza automáticamente la tarifa según el peso del pedido, las dimensiones volumétricas y la distancia kilométrica.
* **Logística Propia / Cadetería Local:**  
  Para entregas dentro del radio urbano de General Roca o Neuquén Capital, se pueden definir tarifas fijas escalonadas por zonas geográficas o distancia en kilómetros desde el depósito central.

### B. Reglas de Envío Gratis (Sin Cargo)
* **Por cercanía geográfica:** Envío sin cargo automático para clientes ubicados dentro de un radio de entrega preferencial (ej. hasta 3 km de la sucursal).
* **Por monto mínimo de compra:** Regla comercial configurable (ej. "Envíos gratis en compras superiores a $45.000") para incentivar el aumento del ticket promedio.
* **Retiro en Tienda (Pick-up):** Opción siempre gratuita en cualquiera de las sucursales habilitadas (Av. Roca 1350 o Mitre 678).

---

## 4. Esquema de Consultas Técnicas: Chatbot vs. WhatsApp

Se implementa una **arquitectura híbrida** que combina la inmediatez de la inteligencia artificial con la calidez del trato humano:

* **Chatbot Web 24/7:**  
  Opera permanentemente en la tienda online para evacuar dudas frecuentes de primer nivel: tabla de micrones y resistencia de polietileno, medidas de moldes de repostería, compatibilidad de descartables, horarios de atención de sucursales y tiempos estimados de envío.
* **Botón Directo a WhatsApp en Ficha de Producto:**  
  Cada producto cuenta con un botón directo a WhatsApp. Al hacer clic, se abre una conversación con el mensaje preformateado indicando el código SKU, el nombre del artículo y la sucursal de interés.
* **Transferencia Fluida a Asesor Comercial:**  
  Si la consulta en el bot web supera su base de conocimiento o el cliente solicita atención mayorista, el sistema deriva la conversación con todo el contexto directamente al WhatsApp del equipo de ventas de Koalas.

---

## 5. Captación de Clientes Más Allá de las Redes Sociales

Para no depender exclusivamente de publicaciones o algoritmos en Instagram o Facebook, se despliega una estrategia de captación multicanal:

1. **Posicionamiento Orgánico en Google (SEO Local):**  
   Optimización técnica on-page para términos con alta intención transaccional en el Alto Valle (ej. *"bolsas de polietileno General Roca"*, *"descartables gastronómicos Neuquén"*, *"cotillón mayorista Río Negro"*).
2. **Fichas de Google Mi Negocio / Google Maps:**  
   Perfil de empresa optimizado con horarios, fotos reales, catálogo sincronizado y reseñas que sitúan a Koalas en los primeros resultados del mapa cuando alguien busca comercios cercanos.
3. **Publicidad de Búsqueda (Google Ads & Google Shopping):**  
   Campañas que muestran los productos exactos con foto, descripción y precio justo en el instante en que un usuario busca un artículo específico para comprar.
4. **Transformación de Empaque Físico en Recompra Digital:**  
   Inclusión de un código QR en las bolsas y cajas de entrega física de Koalas (*"Escaneá y repetí tu pedido con 10% OFF en la web"*), generando recompra recurrente de panaderías, rotiserías y reposteras locales.

---

## 6. Búsqueda en Navegadores con Radio de Ventas Delimitado

* **¿Es posible delimitar las ventas por zona?**  
  **Sí, es 100% posible y es la mejor práctica para e-commerce locales con logística propia o regional.**
* **Implementación en 3 Niveles:**
  1. **Área de Servicio en Google:** Se configura el área de servicio en Google Business Profile para que Google priorice a Koalas únicamente ante usuarios ubicados dentro del radio de influencia comercial.
  2. **Google Ads con Segmentación por Radio Geográfico:** Las campañas de anuncios se delimitan estrictamente por radio en kilómetros (ej. radio de 10 km o 15 km alrededor de cada local), garantizando que el presupuesto se invierta exclusivamente en usuarios con posibilidad real de comprar y recibir el producto.
  3. **Validador de Código Postal en el Checkout:** Si un cliente ingresa un Código Postal fuera de la zona de cobertura configurada, el sistema le notifica amablemente las alternativas disponibles (ej. coordinación de flete especial por expreso o retiro en sucursal).
