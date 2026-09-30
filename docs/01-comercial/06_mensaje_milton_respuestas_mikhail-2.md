# Mensaje para Milton (para reenviar a Mikhail)

**Resumen Comercial y Operativo para la Dirección de Koala (LP SRL)**  
*Destinatario Intermedio: Milton*  
*Destinatario Final: Mikhail Murekian (LP SRL)*  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno*  
*Fecha: Septiembre 2026*

---

## 1. Texto del Mensaje (Listo para Copiar y Enviar por WhatsApp / Email)

```text
Milton, ¿cómo andás? Te resumo lo que consultaron sobre la tienda:

Stock: cuando un cliente confirma una compra en la web, el stock se descuenta en el momento, así no se vende dos veces la misma unidad. Las ventas de mostrador y los ingresos de mercadería se sincronizan con el sistema de gestión, y el encargado de depósito los carga desde ahí.

Tiempos: la puesta en marcha lleva 10 días hábiles desde que recibimos los accesos y la información:
• Días 1 a 3: configuración, diseño base, categorías, medios de pago y envío.
• Días 4 a 8: carga de productos o integración con el sistema, radios de entrega y fletes, y automatización de WhatsApp.
• Días 9 a 10: pruebas de compra, validación de stock y lanzamiento.

Lo que necesitamos de ustedes:
• Listado de productos con precios, descripciones y stock inicial.
• Ubicación del local o depósito, radios de entrega y reglas de envío gratis.
• Accesos de Mercado Pago, cuentas de correo y el WhatsApp oficial.

Cualquier duda me avisás.
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
