# Plan de Implementación y Tiempos para la Tienda Web ("Koalas")

**Documento de Trabajo & Planificación Operativa para Milton y el Equipo de Ventas**  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*  
*Ubicaciones: General Roca (Av. Roca 1350) y Neuquén Capital (Mitre 678)*  
*Fecha: Septiembre 2026 · Clientum E-Commerce & Integraciones*

---

## 1. Requisitos Técnicos y Plazos de Puesta en Marcha

Para formalizar la propuesta y acelerar la toma de decisiones con el equipo de ventas y operaciones de Koalas, a continuación se detallan los requerimientos técnicos, los plazos estimados de implementación y el flujo operativo completo:

* **Tiempo estimado de implementación base:**
  El desarrollo, configuración y puesta a punto completa de la tienda web junto con sus integraciones operativas requiere un plazo estimado de **2 a 5 días hábiles**, dependiendo de la complejidad y volumen del catálogo inicial de artículos.

* **Integración del sistema de gestión (ERP / Depósito):**
  La sincronización por **API y Webhooks** entre el stock central y la tienda web toma aproximadamente de **1 a 2 días hábiles** de pruebas para garantizar que la actualización sea bidireccional y en tiempo real.

* **Configuración logística y pasarelas de pago:**
  La parametrización de operadores logísticos (Andreani, Correo Argentino, OCA, cadetería propia), radios de entrega local y pasarelas de pago (Mercado Pago, transferencias con validación automática) se completa en **1 día hábil**.

---

## 2. Fases del Proyecto y Cronograma de Trabajo (10 Días Hábiles)

El despliegue integral, con pruebas de estrés y control de calidad previo al lanzamiento oficial al público, se estructura en un cronograma de **10 días hábiles** a partir de la confirmación y entrega de los accesos iniciales:

| Etapa | Plazo | Actividades y Entregables Clave |
| :--- | :--- | :--- |
| **Etapa 1: Plataforma & Pasarelas** | **Días 1 a 3** | Configuración inicial de la plataforma, diseño responsivo adaptado a la identidad de marca de Koalas, estructura de categorías principales (Polietileno, Descartables, Repostería, Cotillón) y vinculación de los medios de pago y envío. |
| **Etapa 2: Integración ERP & Automatización** | **Días 4 a 8** | Integración nativa con el sistema de gestión/ERP o carga masiva de productos (según corresponda), configuración de radios de entrega/costos de flete y automatización del chatbot y canal de WhatsApp. |
| **Etapa 3: Pruebas & Lanzamiento** | **Días 9 a 10** | Pruebas integrales de compra extremo a extremo, validación de stock en tiempo real y lanzamiento oficial al público. |

---

## 3. Flujo Operativo Paso a Paso (Circuito Completo)

El proceso operativo desde que se aprueba el proyecto hasta que el cliente final recibe su pedido sigue un flujo estructurado y predecible:

```
[1. Aprobación y Kick-off]
          ↓
[2. Desarrollo y Conexión de Stock en Tiempo Real]
          ↓
[3. Depósito y Carga de Mercadería (Remitos / QR)]
          ↓
[4. Operativa de Compra y Cotización de Envío (CP / Radio)]
          ↓
[5. Gestión Administrativa, Facturación y Etiquetas Logísticas]
          ↓
[6. Despacho y Entrega al Cliente (Correo / Cadetería Propia)]
```

### Detalle de cada paso:

1. **Aprobación y Kick-off:**
   Se confirma el proyecto y se definen los accesos al sistema de gestión actual (ERP), pasarela de pagos y redes/canales oficiales.

2. **Desarrollo y Conexión de Stock:**
   Se estructura la tienda web y se establece la conexión automática por API para la actualización de stock en tiempo real tras cada compra online o escaneo de ingreso en depósito.

3. **Depósito y Carga de Mercadería:**
   El personal de depósito carga remitos o escanea el ingreso; el impacto en la web es inmediato, reactivando productos agotados sin intervención manual.

4. **Operativa de Compra y Envío:**
   El cliente ingresa su Código Postal en el carrito para cotizar el flete automáticamente por distancia/peso, o el sistema aplica la tarifa fija según el radio en kilómetros delimitado o la regla de entrega sin cargo establecida (por monto o cercanía geográfica).

5. **Gestión Administrativa y Financiera:**
   El equipo confirma la operación; el depósito prepara el paquete con opción de generar etiquetas logísticas de despacho de forma automatizada.

6. **Entrega al Cliente:**
   El operador logístico o la cadetería propia despacha el producto, cerrando con éxito el ciclo comercial y enviando el seguimiento al cliente.

---

## 4. Requerimientos para Iniciar (Qué Necesitamos de Ustedes)

Para poder avanzar con la estructuración técnica y acelerar los tiempos de desarrollo al máximo, requerimos:

1. **Listado de Productos y Stock:**
   Base de datos inicial (en formato Excel, CSV o conexión directa a su sistema actual) con detalle de artículos, códigos/SKU, precios (minoristas y listas gremio/mayorista), descripciones y stock inicial por sucursal (General Roca y Neuquén Capital).

2. **Información Logística:**
   Definición exacta de la ubicación del local y depósito central, radios de cobertura para entrega propia (ej. hasta 5 km o 10 km) y tarifas o reglas de envío sin cargo (ej. compras superiores a determinado monto o retiro en tienda gratuito).

3. **Accesos y Canales Oficiales:**
   Datos de acceso a la pasarela de pagos (Mercado Pago u otros), cuentas de correo asociadas para notificaciones comerciales y el número de WhatsApp oficial que se utilizará para la derivación de consultas técnicas y comerciales.
