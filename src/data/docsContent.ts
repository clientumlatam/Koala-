export interface DocItem {
  id: string;
  category: 'comercial' | 'tecnico' | 'demo';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  lastUpdated: string;
  readTime: string;
  summary: string;
  content: string;
  copyableText?: string;
  isPrintableHtml?: boolean;
}

export const DOCUMENTATION_DATA: DocItem[] = [
  {
    id: 'propuesta-unificada',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Propuesta Comercial — Koala Cotillón & Descartables',
    subtitle: 'Plan de Transformación Digital Omnicanal en 3 Etapas (LP SRL)',
    badge: 'Propuesta Oficial',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    summary: 'Documento integral oficial para Koala Cotillón, Descartables y Polietileno (LP SRL — Mikhail Murekian) en General Roca y Neuquén Capital, con desglose de inversión, condiciones y próximos pasos.',
    content: `
# Propuesta Comercial — Clientum × KOALA
**Plan de Transformación Digital Omnicanal**
*Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*
*General Roca, Río Negro y Neuquén Capital, Argentina · Septiembre 2026*

---

## Alcance del Proyecto: Koala Cotillón (LP SRL)
**Expansión de ventas online — e-commerce + SEO + automatización**

* **Cliente**: Koala Cotillón (LP SRL — Mikhail Murekian)
* **Fecha**: Septiembre 2026
* **Duración estimada Etapa 1**: ~15–17 días
* **Ubicaciones**: General Roca (Av. Roca 1350) y Neuquén Capital (Mitre 678)

### Diagnóstico de Situación
El principal dolor de Koala Cotillón es la baja visibilidad y conversión en canales digitales. Quien busca cotillón, globos, polietileno o descartables en Google en el Alto Valle no encuentra a Koala entre los primeros resultados. Las ventas online no reflejan la capacidad real del negocio.
* Ausencia de posicionamiento orgánico en buscadores (SEO).
* Sin e-commerce propio con catálogo actualizado en tiempo real.
* Atención a consultas online sin automatización — cuellos de botella en horarios pico.
* Canales sociales activos (Instagram, Facebook) sin integración fluida al flujo de ventas.

### Plan de Implementación Modular en 3 Etapas
1. **Etapa 1 — E-commerce + Catálogo íntegro + SEO Orgánico (~15–17 días)**:
   - Sitio web con e-commerce completo y catálogo íntegro de productos (descartables, polietileno, repostería, cotillón).
   - Fotos, descripciones y categorías cargadas para todos los artículos.
   - Stock sincronizado y actualizado automáticamente.
   - Estrategia SEO orgánico con palabras clave (cotillón, globos, descartables, polietileno).
   - Optimización técnica on-page para aparecer primero en búsquedas relevantes de Roca y Neuquén.
   - Configuración Google Business Profile y alta en directorios locales.

2. **Etapa 2 — Integración con ERP (A convenir según ERP)**:
   - Conexión bidireccional entre el sistema de gestión y el e-commerce.
   - Precios, stock y productos actualizados automáticamente desde el sistema de gestión.
   - **Reserva atómica de stock en tiempo real**: prevención de quiebres por ventas simultáneas (mostrador físico vs. carrito web).
   - Órdenes web que impactan directamente en el ERP sin intervención manual ni doble carga.

3. **Etapa 3 — Bot Web + Bot WhatsApp con IA (A convenir)**:
   - Chatbot integrado en la página web para atención inmediata de consultas 24/7.
   - Derivación automática desde el bot web hacia WhatsApp Business del local correspondiente.
   - Bot de WhatsApp con mensajes predefinidos y flujos de calificación para acompañar y cerrar operaciones.
   - Servidor MCP para consultar inventario real en vivo sin alucinaciones de precios ni stock.
   - Integrado con Instagram y Facebook como canales de entrada adicionales.

### Estructura de Inversión — Koala Cotillón
| Concepto | Setup (ARS) | Mensual (ARS) | Condición |
| :--- | :--- | :--- | :--- |
| **Etapa 1 — E-commerce + SEO** | $ 518.000 (o a definir) | $ 104.000 / $ 133.200 | Pago al inicio |
| **Etapa 2 — Integración ERP** | $ 414.400 (o a convenir) | $ 86.000 / $ 111.000 | A convenir según ERP |
| **Etapa 3 — Bots Web + WhatsApp** | $ 187.600 (o a convenir) | $ 77.000 / $ 66.600 | Al inicio de la etapa |
| **PACK COMPLETO SUGERIDO** | **$ 1.120.000** | **$ 267.000 / $ 310.800** | Anticipo 50% al iniciar |

*Validez: 15 días corridos. Los valores no incluyen IVA.*

---

## ¿Por qué Clientum?
* **Precios en ARS y soporte local**: Equipo basado en General Roca (Patagonia). Soporte y mantenimiento garantizado 365 días, respuesta menor a 4 horas.
* **Tecnología propia y flexible**: Sin dependencia de plataformas extranjeras. Stack probado: WhatsApp API, agentes IA, sincronización ERP y e-commerce de alta velocidad.
* **Stack probado en producción**: WhatsApp API oficial (Cloud API Meta), agentes IA con MCP, sincronización ERP-ecommerce, WooCommerce/PrestaShop con integraciones propias.
* **Trazabilidad y control**: Panel de administración con monitor de sincronización ERP, hub de stock, API tester y auditoría completa de todas las operaciones.

---

## Condiciones y Próximos Pasos
1. **Revisión de la propuesta**: Mikhail y equipo LP SRL revisan el alcance de las 3 etapas, los valores y las condiciones.
2. **Firma del documento**: Firma formal de esta propuesta comercial como constancia de inicio de proyecto.
3. **Acreditación del anticipo**: Acreditación del anticipo correspondiente (50% del pack elegido o 100% Etapa 1).
4. **Kickoff y reunión de inicio**: Reunión de inicio para relevamiento de ERP actual, accesos y cronograma detallado.
5. **Entrega Etapa 1 (~15–17 días)**: E-commerce operativo con catálogo completo, SEO activo y Google Business Profile configurado.

*Esta propuesta comercial tiene una validez de 15 días corridos desde su emisión. Los valores no incluyen IVA. El inicio formal del proyecto queda sujeto a la firma de este documento y a la acreditación del anticipo correspondiente.*
    `
  },
  {
    id: 'email-mikhail',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Plantilla de Email — Mikhail Murekian (LP SRL)',
    subtitle: 'Correo formal de presentación de la propuesta de 3 etapas',
    badge: 'Listo para Enviar',
    lastUpdated: 'Septiembre 2026',
    readTime: '3 min',
    summary: 'Email listo para enviar formalizando la propuesta tras la llamada, enfocado en el dolor de visibilidad y en la estructura modular de 3 etapas.',
    copyableText: `De: Clientum <info@clientum.com.ar>
Para: Mikhail Murekian <mmurekian@lpsrl.com.ar>
Asunto: Propuesta Clientum × Koala Cotillón — Transformación digital omnicanal en 3 etapas

Hola Mikhail,

Te comparto la propuesta formal para el proyecto de transformación digital que estuvimos conversando para Koala Cotillón y LP SRL.

El objetivo central es resolver de raíz el principal dolor actual: la baja visibilidad orgánica en buscadores y la falta de un canal online integrado que capture la demanda que hoy se pierde. Quien busca en Roca, Neuquén y el Alto Valle cotillón, descartables o polietileno debe encontrar a Koala en primer lugar.

Estructuramos el plan de trabajo en tres etapas modulares:

Etapa 1 — E-commerce + Catálogo Completo + SEO Orgánico (~15–17 días)
- Plataforma Web & Catálogo: Tienda online ágil con todo el catálogo de Koala (descartables, polietileno, cotillón, repostería, bazar y librería) con fotos, especificaciones y precios actualizados.
- Medios de Pago y Financiación: Integración para cobro con tarjeta, débito, transferencia y cuotas sin interés.
- Derivación de Pedidos: Derivación automática con pedido desglosado directo al WhatsApp del equipo de ventas de la sucursal correspondiente (General Roca o Neuquén).
- Posicionamiento Orgánico (SEO): Optimización técnica on-page y estrategia de palabras clave (cotillón, globos, bolsas de polietileno, descartables gastronómicos) junto al alta y optimización en Google Business Profile para liderar las búsquedas locales desde el primer día.

Etapa 2 — Integración con ERP y Sincronización de Stock
- Conexión bidireccional entre el sistema de gestión y la tienda online.
- Precios, listas y stock sincronizados automáticamente sin doble carga administrativa.
- Mecanismo de Reserva en Tiempo Real: Resuelve el conflicto de venta simultánea. Al momento del checkout online se genera una reserva temporal contra el ERP; si en el mostrador físico ya se vendió la última unidad, la reserva online se bloquea preventivamente evitando quiebres o sobreventas.
- Nota: Al estar en proceso de evaluación de un nuevo ERP de planta (con MRP I/II para extrusión e impresión, como ERPNext o Dolibarr), diseñamos la arquitectura lista para acoplarse directamente al sistema definitivo.

Etapa 3 — Bot Web + Bot de WhatsApp con IA
- Chatbot interactivo en la web disponible 24/7 para responder consultas sobre productos, sucursales y cotizaciones.
- Bot de atención en WhatsApp con derivación inteligente: responde consultas frecuentes de catálogo y precios, y califica al cliente antes de derivarlo al vendedor correspondiente.
- Conexión mediante arquitectura flexible (compatible con WhatsApp Cloud API oficial de Meta y conector MCP para consultar inventario real en vivo).

El dolor que atacamos es concreto y medible: transformar la demanda pasiva en ventas concretas, automatizando la atención y dando escalabilidad a la operación tanto en Roca como en Neuquén.

Quedamos a tu entera disposición para coordinar una breve videollamada y recorrer juntos la propuesta y despejar cualquier duda técnica.

Un saludo cordial,

Jonathan Ledantes / Matias Rotili
Clientum — Automatización e Inteligencia Artificial para PyMEs
General Roca, Río Negro, Argentina
clientum.com.ar | info@clientum.com.ar`,
    content: `
### Plantilla de Correo Lista para Enviar
Utilizá el botón superior para copiar el texto con formato directamente a tu cliente de correo.
    `
  },
  {
    id: 'puntos-de-dolor',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Puntos de Dolor: Redes Sociales → E-Commerce → ERP',
    subtitle: 'Diagnóstico exhaustivo y cadena de valor priorizada',
    badge: 'Estratégico',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    summary: 'Análisis detallado de la fuga de ventas en redes sociales, la ausencia de un destino transaccional ágil y el riesgo operativo de sobreventa mostrador vs. web.',
    content: `
# Puntos de Dolor y Arquitectura de Conversión: Redes Sociales → E-Commerce → ERP

---

## 1. Prioridad 1: Redes Sociales → E-Commerce (Captura y Conversión)

### Los Dolores Actuales:
1. **Fuga masiva de clientes en Instagram y Facebook**:
   * Las publicaciones se llenan de comentarios y mensajes directos (*"¿Precio?", "¿Tienen stock en Roca?"*).
   * Al responder de forma manual horas o días después, el cliente ya compró en otro lado. En el negocio de cotillón y descartables, **si no respondés en 5 minutos, la venta se pierde**.
2. **Falta de destino transaccional**:
   * Hoy las redes derivan a un chat manual sin catálogo. El usuario tiene que pedir fotos y listas una por una.
3. **Pérdida de presupuestos sin trazabilidad**:
   * No queda registro de cotizaciones, clientes ni fechas de vencimiento.

### La Solución Implementada:
* **Automatización con triggers**: Respuestas automáticas que derivan al link exacto del producto en la tienda online o inician conversación calificada en WhatsApp.
* **E-Commerce Mobile-First**: Catálogo ágil donde el usuario que entra desde Instagram compra o cotiza en 3 clics.
* **Derivación estructurada a WhatsApp**: El carrito genera un pedido desglosado con código de cotización para que el vendedor cierre la operación de inmediato.

---

## 2. Prioridad 2: E-Commerce → ERP (Sincronización y Cero Quiebre)

### Los Dolores Actuales:
1. **El miedo a la venta simultánea (Conflicto Mostrador vs. Web)**:
   * Cobrar online un producto que un vendedor presencial acaba de pasar por caja genera quiebres de stock graves.
2. **Doble carga administrativa y costos operativos**:
   * Empleados transcribiendo pedidos a mano en el sistema de gestión interno, propensos a errores de tipeo o SKU.
3. **Pérdida de margen por desactualización de precios**:
   * Con variaciones constantes en costos de materias primas (polietileno, resinas), demorar días en actualizar precios web deteriora la rentabilidad.

### La Solución Implementada:
* **Reserva Atómica en Checkout**: Bloqueo preventivo de stock por 15 minutos en el ERP mientras el cliente paga.
* **Sincronización Bidireccional Continua**: Un cambio de precio en el ERP impacta en la tienda online al instante.
* **Ingreso Directo de Pedidos al ERP**: Cada compra confirmada entra como pedido o remito en la sucursal correspondiente.

---

## 3. Prioridad 3: Posicionamiento Orgánico (SEO)
* **Dolor**: Quien busca en Google en el Alto Valle no encuentra a Koala primero.
* **Solución**: SEO on-page, datos estructurados Schema.org y Google Business Profile en General Roca y Neuquén.
    `
  },
  {
    id: 'resumen-ejecutivo',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Resumen Ejecutivo — Transformación Omnicanal Koala',
    subtitle: 'Pilares estratégicos, 3 etapas y beneficios medibles para el negocio',
    badge: 'Ejecutivo',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    summary: 'Síntesis ejecutiva de la visión general, las 3 etapas de implementación (E-Commerce+SEO, ERP y Bots) y los beneficios medibles para LP SRL.',
    content: `
# Resumen Ejecutivo del Proyecto — Koala Lo Tiene & Clientum
*Transformación Digital Omnicanal · General Roca y Neuquén Capital*

---

## 1. Visión General del Proyecto

Koala Lo Tiene es un referente indiscutido en la distribución de artículos de cotillón, repostería, descartables y polietileno en el Alto Valle. El objetivo de este proyecto es dotar a la empresa de una **infraestructura omnicanal de alta gama** que combine:
1. Una tienda e-commerce optimizada para motores de búsqueda (SEO local).
2. Sincronización bidireccional con su sistema de gestión (ERP actual o nuevo).
3. Automatización de ventas y atención 24/7 mediante bots en Web y WhatsApp.

---

## 2. Las 3 Etapas de Implementación

### Etapa 1: E-Commerce + Catálogo Completo + SEO Orgánico (~15–17 días)
* **Alcance**: 
  - Desarrollo de plataforma web transaccional con diseño adaptativo mobile-first.
  - Carga y optimización de más de 30 categorías de productos con fotografías profesionales sobre fondo blanco.
  - Optimización SEO on-page orientada a términos clave (*cotillón en General Roca, descartables en Neuquén, bolsas de polietileno mayorista, velas y repostería*).
  - Alta y optimización de Google Business Profile para ambas sucursales.

### Etapa 2: Integración con ERP (Sincronización Bidireccional)
* **Alcance**:
  - Conexión con el software de gestión actual de Koala (Tango Software, Flexxus, Bejerman o nuevo ERP).
  - Sincronización automática de listas de precios (Mayorista y Minorista).
  - Control de stock multi-sucursal en tiempo real (**Depósito General Roca DEP-01** vs **Salón Neuquén Capital DEP-02**).
  - Inyección automática de pedidos web en el ERP sin doble carga administrativa.
  - **Reserva atómica preventiva de 15 minutos** para erradicar quiebres por venta simultánea mostrador vs. online.

### Etapa 3: Bot Web + Bot WhatsApp + Alertas de Stock
* **Alcance**:
  - Asistente virtual inteligente integrado en el sitio web y WhatsApp Business.
  - Derivación automática de clientes con carritos prearmados hacia el equipo de ventas.
  - Servidor MCP para consultas de stock y precios sin alucinaciones.
  - Panel de control operativo con seguimiento de pedidos y estados de pago.

---

## 3. Beneficios Esperados para el Negocio

* **Captura de Demanda Insatisfecha**: Clientes del Alto Valle que buscan productos en Google y terminan comprando en la competencia o en plataformas foráneas.
* **Reducción de Carga Operativa**: Eliminación de la toma de pedidos manual por WhatsApp; el carrito estructura la compra y el ERP descuenta el stock automáticamente.
* **Fidelización Comercial**: Sistema de listas diferenciadas y beneficios para reposteros, gastronómicos y comercios mayoristas.
* **Trazabilidad Logística**: Visibilidad inmediata del estado de los pedidos y de los traspasos de mercadería entre General Roca y Neuquén.
    `
  },
  {
    id: 'manual-erp',
    category: 'tecnico',
    categoryLabel: '02. Técnico & ERP',
    title: 'Manual de Integración ERP — Especificaciones Técnicas',
    subtitle: 'Arquitectura de Webhooks, REST API y Sincronización Multi-Sucursal',
    badge: 'Técnico',
    lastUpdated: 'Septiembre 2026',
    readTime: '8 min',
    summary: 'Documentación técnica de endpoints REST, payloads JSON, sincronización por lotes CSV y mapeo de depósitos (Roca DEP-01 y Neuquén DEP-02).',
    content: `
# Manual de Integración ERP — Koala Lo Tiene

## 1. Identificación de Sucursales y Depósitos
| ID Sucursal | Código ERP | Nombre / Ubicación | Rol en el Sistema |
| :--- | :--- | :--- | :--- |
| \`roca\` | \`DEP-01\` | **Casa Central & Fábrica** (Av. Roca 1350, General Roca) | Depósito principal de polietileno y venta mayorista/minorista |
| \`neuquen\` | \`DEP-02\` | **Salón Comercial** (Mitre 678, Neuquén Capital) | Salón de venta directa, cotillón y repostería |

---

## 2. Endpoints Principales del Gateway

### Actualización Masiva de Stock y Precios
* **Método**: \`POST\` / \`PATCH\`
* **Ruta**: \`/api/erp/inventory-sync\`
* **Autenticación**: \`Authorization: Bearer <API_SECRET_TOKEN>\`

\`\`\`json
{
  "timestamp": "2026-09-16T18:00:00.000Z",
  "sourceSystem": "TANGO_OR_DOLIBARR",
  "items": [
    {
      "sku": "POL-BOL-CAM-4050",
      "name": "Bolsa Camiseta Blanca 40x50 cm",
      "price": 4200,
      "wholesalePrice": 3650,
      "stockRoca": 450,
      "stockNeuquen": 120
    }
  ]
}
\`\`\`

### Reserva Atómica de Stock (Checkout Web)
* **Método**: \`POST\`
* **Ruta**: \`/api/erp/stock/reserve\`
* **Payload**:
\`\`\`json
{
  "branchId": "roca",
  "items": [
    { "sku": "POL-BOL-CAM-4050", "quantity": 10 }
  ],
  "holdDurationMinutes": 15,
  "sessionId": "chk_sess_98234"
}
\`\`\`
* **Respuesta Exitosa**: \`{ "reserved": true, "expiresAt": "2026-09-16T18:15:00Z" }\`
* **Respuesta en Quiebre**: \`{ "reserved": false, "reason": "OUT_OF_STOCK", "available": 2 }\`
    `
  },
  {
    id: 'respuestas-tecnicas-mikhail',
    category: 'tecnico',
    categoryLabel: '02. Técnico & ERP',
    title: 'Respuestas Técnicas para Mikhail Murekian',
    subtitle: 'Argumentación para videollamada: Reserva atómica, Evolution API y MCP',
    badge: 'Crítico para Cierre',
    lastUpdated: 'Septiembre 2026',
    readTime: '6 min',
    summary: 'Respuestas paso a paso a las tres objeciones críticas de Mikhail: conflicto de sobreventa mostrador vs. web, riesgos de Evolution API y rol del servidor MCP.',
    copyableText: `Argumentos Clave para la Reunión con Mikhail:

1. CONFLICTO MOSTRADOR VS. WEB (VENTA SIMULTÁNEA):
No usamos sincronización cada X minutos para el checkout. Implementamos una Reserva Atómica Temporal (Locking de 15 min): al momento de pagar online, la web bloquea la unidad en el ERP. Si el mostrador vendió el artículo segundos antes, el sistema frena la compra online de inmediato y avisa que no hay stock antes de cobrar, impidiendo el quiebre. Si el usuario no abona en 15 minutos, el producto se libera automáticamente.

2. RIESGO DE EVOLUTION API (WHATSAPP NO OFICIAL):
La arquitectura es 100% desacoplada. La inteligencia del bot, las reglas de negocio y las conexiones al ERP corren en nuestro backend propio; Evolution API es solo un conector de transporte. Si Meta cambia el protocolo o el volumen de Koala crece, se migra a WhatsApp Cloud API oficial de Meta cambiando solo el conector sin rehacer el bot ni perder configuraciones.

3. QUÉ HACE EL SERVIDOR MCP (MODEL CONTEXT PROTOCOL):
MCP es el estándar que le da "ojos y herramientas en vivo" al modelo de IA. En vez de responder con datos estáticos desactualizados o alucinar precios, cuando un cliente pregunta en WhatsApp: "¿Tienen film alveolar en Roca y a cuánto?", el bot invoca la herramienta MCP, consulta el ERP en milisegundos y responde con el stock y precio real del instante.`,
    content: `
# Respuestas Técnicas a las Dudas de Mikhail Murekian (LP SRL)

---

### 1. Conflicto de Venta Simultánea (Mostrador vs. Online)
* **Problema**: Venta presencial en Av. Roca 1350 al mismo tiempo que entra un pago web.
* **Solución**: **Reserva Atómica en Checkout (Locking Temporal)**.
  - Al iniciar el pago online, la web ejecuta \`POST /api/erp/stock/reserve\` colocando un bloqueo preventivo de 15 minutos en el ERP.
  - Si el mostrador vendió la unidad segundos antes, la reserva falla y el carrito avisa: *"Producto agotado en Roca. ¿Desea transferir desde Neuquén?"*, evitando cobrar algo inexistente.
  - Si el usuario abandona la compra, a los 15 minutos el bloqueo se libera automáticamente.

---

### 2. Riesgo de Evolution API (Protocolo no oficial de WhatsApp)
* **Arquitectura desacoplada**: El bot, la lógica y los datos están en nuestro servidor central; Evolution API es solo el canal de transporte.
* **Migración transparente**: Si Meta actualiza protocolos o el tráfico lo amerita, se migra a **WhatsApp Cloud API oficial** conectando las credenciales sin rehacer el bot.

---

### 3. Rol del Servidor MCP (Model Context Protocol)
* **Qué hace**: Es el puente seguro entre el modelo de IA y la base de datos del ERP.
* **Beneficio**: El agente de IA responde en WhatsApp con stock, medidas y precios exactos en tiempo real, sin alucinaciones ni desfasajes.
    `
  },
  {
    id: 'guia-demo-meet',
    category: 'demo',
    categoryLabel: '03. Guión Demo & Ventas',
    title: 'Guión de Demostración en Vivo para Google Meet',
    subtitle: 'Estructura cronometrada paso a paso (15–20 min) para cerrar la venta',
    badge: 'Guión de Ventas',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    summary: 'Estructura de llamada de 15 a 20 minutos con diagnóstico inicial, recorrido por el e-commerce, demostración de stock multi-sucursal y manejo de objeciones.',
    content: `
# Guía de Demostración para Google Meet — Koala Lo Tiene

## Estructura de la Reunión (15 a 20 Minutos)

### Minuto 00 - 03: Diagnóstico y Oportunidad
* *"Hola a todos. Estuvimos analizando el posicionamiento digital de Koala en el Alto Valle. Hoy, cuando un cliente busca artículos de cotillón, repostería o descartables en General Roca o Neuquén, la competencia se queda con esas ventas porque no hay una plataforma e-commerce ágil que refleje el stock real de sus sucursales. Venimos a presentarles una solución integral dividida en 3 etapas concretas para potenciar las ventas online y unificar su operación."*

### Minuto 03 - 08: Demostración de la Etapa 1 (E-commerce + Catálogo + SEO)
* Mostrar interfaz adaptada a móviles.
* Selector de sucursal (**General Roca - Av. Roca 1350** vs **Neuquén Capital - Mitre 678**).
* Navegar por categorías (Polietileno, Descartables, Cotillón, Repostería).
* Fichas de producto con etiquetas mayoristas/minoristas y agregador al carrito.

### Minuto 08 - 12: Demostración de la Etapa 2 (Integración ERP y Logística)
* Mostrar cómo el stock se actualiza entre ambas sucursales.
* Mostrar el **Simulador de Traspaso Inter-sucursales por Ruta 22**.
* Demostrar la **Reserva de Stock Preventiva**: cómo el sistema bloquea compras si el producto se agota en mostrador.
* Mostrar el importador masivo de precios por archivo CSV.

### Minuto 12 - 15: Demostración de la Etapa 3 (Bots Web + WhatsApp + Asistente IA)
* Abrir el Asistente IA lateral y hacer una consulta técnica de productos de polietileno.
* Mostrar la derivación con pedido estructurado a WhatsApp.

### Minuto 15 - 20: Cierre y Pregunta Clave
* *"La Etapa 1 la podemos tener operativa y posicionándose en Google en 15 a 17 días. ¿Les parece bien que avancemos con la firma del proyecto para comenzar la semana próxima?"*

---

## 🎯 Regla de Oro Comercial (Manejo de Objeción ERP con Mikhail)
* **Si Mikhail dice que están por cambiar de sistema de gestión / ERP**:
  * **Respuesta táctica**: *"¡Excelente! Justamente por eso diseñamos la propuesta en etapas modulares. Lanzamos primero la **Etapa 1 (~15 a 17 días)** para que Koala empiece a facturar online, posicione en Google con SEO y capture clientes ya mismo. Durante ese mes, ustedes definen con tranquilidad si migran a Tango, Dolibarr o su ERP a medida, y cuando esté listo, conectamos la **Etapa 2** directo al software definitivo sin tener que reprogramar dos veces."*
* **Si preguntan sobre este sitio**:
  * Explicar que este es el **Gemelo Digital Interactivo** desarrollado por Clientum para que el directorio pueda tocar, probar y auditar cada flujo (checkout, reserva atómica, bots y logística) antes de la puesta en marcha definitiva.
    `
  }
];
