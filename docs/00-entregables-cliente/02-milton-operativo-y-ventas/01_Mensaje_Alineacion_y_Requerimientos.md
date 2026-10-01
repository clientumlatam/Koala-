# Mensaje para Milton (para reenviar a Mikhail)

**Resumen Comercial y Operativo para la Dirección de Koala (LP SRL)**  
*Destinatario Intermedio: Milton*  
*Destinatario Final: Mikhail Murekian (LP SRL)*  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno*  
*Fecha: Septiembre 2026*

---

## 1. Texto del Mensaje (Listo para Copiar y Enviar por WhatsApp / Email)

```text
Milton, ¿cómo andás? Te paso el resumen alineado para reenviar a Mikhail sobre la tienda web de Koala:

1. Stock y Compras Simultáneas:
Cuando un cliente inicia el pago en la tienda web, el sistema realiza una reserva atómica e instantánea de ese producto durante el proceso de checkout. Esto evita que dos compradores online o el mostrador vendan la misma unidad en paralelo. La sincronización de las ventas físicas del mostrador e ingresos de depósito se coordina con el sistema de gestión según la frecuencia de consulta establecida.

2. Tiempos de Implementación (10 Días Hábiles):
La puesta en marcha completa toma 10 días hábiles a partir de la recepción de los accesos e información:
• Días 1 a 3: Estructuración de la tienda, diseño base, categorías y vinculación de medios de pago y envío (visible en dirección provisoria para revisión interna).
• Días 4 a 8: Carga de productos/ERP, configuración de radios de entrega/fletes y automatización del canal de atención por WhatsApp.
• Días 9 a 10: Pruebas integrales de compra, validación de stock y lanzamiento público oficial.

3. Requerimientos de Inicio:
• Catálogo de productos con precios, descripciones y stock inicial.
• Reglas logísticas de entrega (dirección de depósito, radios en km o costo de flete).
• Credenciales operativas: acceso a Mercado Pago, cuenta de correo oficial y WhatsApp de ventas.
• Credenciales de lectura (Read-Only) al sistema de gestión para el servidor de consulta en tiempo real (MCP).

4. Dominio y Configuración Web:
Realizaremos el cambio de servidores DNS en NIC Argentina en un horario tranquilo. El servicio de correo actual se mantendrá 100% operativo sin interrupciones.

Cualquier duda quedo a disposición.
```

---

## 2. Nota Técnica Crítica (Antes de Enviar)

> ⚠️ **Advertencia sobre la promesa de sincronización en "0 segundos":**  
> Revisá con qué frecuencia se sincroniza el stock con el sistema de gestión / ICXN.  
> 
> En algunas respuestas iniciales se menciona "0 segundos", pero si la sincronización técnica con el sistema de gestión del depósito es mediante consultas periódicas programadas (cron jobs cada 5 o 15 minutos) y no mediante webhooks bidireccionales en tiempo real, el descuento de la venta web es inmediato en la tienda online pero el impacto de una venta física de mostrador tardará ese intervalo en verse reflejado en la web.  
> 
> Por este motivo, en el borrador comercial final se especifica que el descuento es instantáneo ante la compra online y que la sincronización con el sistema físico se realiza de forma coordinada, sin prometer plazos irreales de cero segundos en mostrador hasta no auditar los webhooks nativos del ERP.

---

## 3. Resumen de Puntos Clave

1. **Prevención de Sobreventa (Over-selling):**  
   El motor e-commerce descuenta de inmediato el stock en el momento exacto en que la orden de compra queda confirmada, garantizando que dos clientes no adquieran la misma unidad en paralelo.

2. **Cronograma Concreto de 10 Días Hábiles:**  
   Plazo realista y medible dividido en tres etapas modulares: Base (Días 1-3), Integración y Automatizaciones (Días 4-8), y QA con Lanzamiento Oficial (Días 9-10).

3. **Requerimientos Clave:**  
   Listado inicial de artículos (Excel/ERP), reglas logísticas territoriales y credenciales operativas.
