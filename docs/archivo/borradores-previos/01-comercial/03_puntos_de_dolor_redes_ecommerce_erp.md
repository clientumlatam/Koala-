# Puntos de Dolor y Arquitectura de Conversión: Redes Sociales → E-Commerce → ERP

Este documento detalla los dolores operativos y comerciales de Koala Cotillón (LP SRL) y Koala Ferretería, organizados bajo la cadena prioritaria: **Redes Sociales → E-commerce → ERP**.

---

## 1. Prioridad 1: Redes Sociales → E-Commerce (Captura y Conversión)

### Los Dolores Actuales:
1. **Fuga masiva de clientes en Instagram y Facebook**:
   * Koala tiene canales sociales activos con buen alcance orgánico (especialmente Instagram), pero las publicaciones terminan en decenas de comentarios y mensajes directos (DMs) del tipo: *"¿Precio?", "¿Tienen stock en Roca?", "¿Hacen envíos a Neuquén?"*.
   * **Cuello de botella humano**: El personal de mostrador o administración responde con horas o días de retraso. En el negocio de cotillón, repostería y descartables, la compra suele ser impulsiva o urgente para un evento: **si no respondés en 5 minutos, el cliente le compra a la competencia**.
2. **Falta de destino transaccional**:
   * Hoy las redes derivan a un chat manual o a un teléfono donde no se puede ver el catálogo completo ni autogestionar el pedido. No existe un link directo hacia la ficha del producto con fotos, medidas, stock y financiación.
3. **Pérdida de presupuestos sin seguimiento**:
   * Se cotizan productos por chat suelto; no queda registro de quién preguntó, qué necesitaba ni cuándo venció la cotización.

### La Solución Implementada:
* **Automatización de entrada**: Respuestas automáticas y disparadores (triggers) en Instagram/Facebook que derivan al link exacto del producto en la tienda online o inician una conversación calificada en WhatsApp.
* **Catálogo Mobile-First**: Tienda optimizada para celulares donde el usuario que entra desde una historia de Instagram ve el producto, el precio por bulto/unidad, las cuotas disponibles y puede comprarlo en 3 clics.
* **Derivación estructurada a WhatsApp**: Si el cliente necesita asesoramiento, el carrito genera un mensaje pre-armado con código de cotización, sucursal elegida e ítems desglosados para que el vendedor cierre la venta en un segundo.

---

## 2. Prioridad 2: E-Commerce → ERP (Sincronización y Cero Quiebre)

### Los Dolores Actuales:
1. **El miedo a la venta simultánea (Conflicto Mostrador vs. Web)**:
   * Si un cliente presencial en la sucursal de General Roca (Av. Roca 1350) compra el último paquete de globos o la última bobina de film a las 11:15 hs, y a las 11:16 hs entra una compra web por ese mismo artículo, se genera un quiebre de stock vergonzoso: cobrar algo que ya no existe en el depósito.
2. **Doble carga administrativa y costos operativos**:
   * Cargar a mano cada pedido de la web en el sistema de gestión del local consume horas de trabajo de los empleados y es propenso a errores humanos de tipeo, SKU, precios o alícuotas de IVA.
3. **Pérdida de margen por desactualización de precios**:
   * Con listas de proveedores dinámicas (resinas plásticas, polietileno, artículos de repostería importados), modificar precios en el ERP y no verlos reflejados inmediatamente en la web hace que se vendan productos con precios desfasados.

### La Solución Implementada:
* **Reserva Atómica en Checkout**: Al iniciar el pago online, la web consulta al ERP y coloca un bloqueo preventivo (lock) de 15 minutos en esa sucursal. Si el mostrador físico ya vendió la unidad, la web avisa al instante y evita cobrar en quiebre.
* **Sincronización Bidireccional de Precios y Stock**: Las listas del ERP alimentan la web de forma programada o por webhook. Un cambio en el sistema de gestión impacta en la tienda sin intervención manual.
* **Ingreso Directo de Pedidos al ERP**: Cada compra confirmada ingresa automáticamente como pedido/remito en el ERP asignado a la sucursal correspondiente (General Roca o Neuquén).

---

## 3. Prioridad 3: Posicionamiento Orgánico (SEO) & Omnicanalidad

### El Dolor:
* Quien busca en Google *"cotillón general roca"*, *"bolsas de polietileno neuquén"*, *"descartables gastronómicos cipolletti"* no encuentra a Koala en el primer lugar orgánico. Toda la demanda pasiva de búsqueda en internet se la llevan distribuidores más pequeños o Mercado Libre.

### La Solución:
* Estructura web indexable con fichas de producto optimizadas (SEO on-page), Schema.org de producto y negocio local, y vinculación directa con Google Business Profile en Roca y Neuquén.

---

## Resumen Ejecutivo de la Cadena de Valor

```
┌─────────────────────────┐
│     REDES SOCIALES      │
│  (Instagram / Facebook) │ ──► Foco: Frenar la fuga de leads, responder al instante
└────────────┬────────────┘     y derivar tráfico calificado con links directos.
             │
             ▼
┌─────────────────────────┐
│       E-COMMERCE        │
│    (Koala Lo Tiene)     │ ──► Foco: Mostrar catálogo íntegro, fotos reales,
└────────────┬────────────┘     precios minorista/mayorista, cuotas y carrito ágil.
             │
             ▼
┌─────────────────────────┐
│       SISTEMA ERP       │
│  (Tango/Dolibarr/MRP)   │ ──► Foco: Reserva atómica de stock en tiempo real,
└─────────────────────────┘     cero sobreventas, precios unificados y remito automático.
```
