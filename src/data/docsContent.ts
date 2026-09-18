export interface DocItem {
  id: string;
  category: 'comercial' | 'tecnico' | 'demo' | 'pipeline' | 'backend';
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
  requiresClientumSupport?: boolean;
  restrictedToRole?: string[];
}

export const DOCUMENTATION_DATA: DocItem[] = [
  {
    id: 'propuesta-unificada',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Propuesta Comercial — Koala Cotillón & Descartables',
    subtitle: 'Plan de Transformación Digital Omnicanal en 3 Etapas (LP SRL)',
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '3 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '6 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
    badge: 'Exclusivo Soporte Clientum',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
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
  },
  {
    id: 'pipeline-omnicanal-unificado',
    category: 'pipeline',
    categoryLabel: '03. Pipeline Omnicanal',
    title: 'Pipeline Omnicanal Unificado: Redes Sociales ➔ E-Commerce ➔ ERP',
    subtitle: 'La Sincronización Definitiva del Ciclo Comercial Moderno (Captura, Conversión y ERP)',
    badge: 'Arquitectura Estratégica',
    lastUpdated: 'Septiembre 2026',
    readTime: '7 min',
    summary: 'El concepto de un pipeline unificado que conecta redes sociales, comercio electrónico y sistema ERP. Detalle de sus 3 pilares, tabla de integración de datos, ventajas competitivas y automatización de marketing.',
    copyableText: `EL CONCEPTO DEL PIPELINE OMNICANAL UNIFICADO:
Redes Sociales ──(Leads/Consultas)──> E-commerce ──(Órdenes/Stock)──> Sistema ERP
  (Atracción y Captura)                  (Conversión)                 (Operación y Finanzas)

1. Captura (Redes Sociales): Instagram, TikTok, LinkedIn, Facebook.
2. Conversión (E-commerce): Tienda online y Social Commerce en 3 clics.
3. Procesamiento (ERP): Órdenes, reserva atómica de stock, facturación y despacho automático.

Ventajas Clave:
- Segmentación Inteligente de Campañas con historial de compra del ERP.
- Cumplimiento y Logística en tiempo real (Fulfillment en segundos).
- Visibilidad Financiera y Conciliación Inmediata de Flujo de Caja.
- Marketing Automation: Targeted Lists -> Execute Campaign -> Measure Behaviour -> Segment & Score Leads -> Route to CRM -> Nurture Cycle -> Sales Analytics.`,
    content: `
# Pipeline Omnicanal Unificado: Redes Sociales ➔ E-commerce ➔ Sistema ERP
**La sincronización definitiva del ciclo comercial moderno para Koala Lo Tiene y LP SRL**

El concepto de un pipeline unificado que conecte redes sociales, comercio electrónico y un sistema ERP representa la sincronización definitiva del ciclo comercial moderno. Consiste en crear un flujo de datos automatizado donde cada interacción con un cliente se convierte en una venta y se procesa operativamente de inmediato. [1, 2, 3, 4]

A continuación, se detalla cómo funciona la estructura de este pipeline y cómo interactúan sus tres pilares esenciales:

---

## ⛓️ La estructura del Pipeline Omnicanal

Este ecosistema automatiza el recorrido del cliente dividiéndolo en tres etapas perfectamente conectadas:

\`\`\`
[ Redes Sociales ] ──(Leads/Consultas)──> [ E-commerce ] ──(Órdenes/Stock)──> [ Sistema ERP ]
  (Atracción y Captura)                      (Conversión)                    (Operación y Finanzas)
\`\`\`

1. **Captura (Redes Sociales)**: El pipeline inicia atrayendo clientes en plataformas como Instagram, TikTok, LinkedIn o Facebook. Las consultas en comentarios, mensajes directos o clics en anuncios capturan el interés inicial. [1, 4, 5, 6]
2. **Conversión (E-commerce)**: El tráfico se dirige de forma fluida a la tienda online (o mediante herramientas de Social Commerce como Instagram Shopping) para que el usuario concrete la compra. [5]
3. **Procesamiento (ERP)**: En el momento en que se genera la orden, los datos viajan al ERP (Enterprise Resource Planning) sin intervención manual. El sistema actualiza el inventario global, emite la factura, gestiona la contabilidad y programa el envío. [3, 7]

---

## 🔄 Flujo de datos e Integración entre componentes

| Conexión | ¿Qué datos se transmiten? | Beneficio Clave |
| :--- | :--- | :--- |
| **Social Media ➔ E-commerce** | Enlaces de productos, etiquetas de compra (shoppable tags), sincronización de catálogos y píxeles de seguimiento. | **Experiencia de compra fluida**: El cliente compra el producto que vio en su feed con un solo clic. |
| **Social Media ➔ ERP / CRM** | Mensajes directos, datos de contacto de leads y registros de interacciones. | **Historial centralizado**: El equipo de soporte o ventas conoce todo el contexto y consultas previas del cliente antes de responder. |
| **E-commerce ➔ ERP** | Órdenes de compra, pasarelas de pago, perfiles de clientes y datos fiscales. | **Automatización total**: Se elimina el error humano de digitar pedidos manualmente y se agiliza el despacho. |
| **ERP ➔ E-commerce y Redes** | Niveles de stock en tiempo real, precios actualizados y estados de envío. | **Adiós al sobrestock**: Evita vender en la web o anunciar en redes productos que ya están agotados en el almacén físico. |

---

## 🚀 Ventajas estratégicas del pipeline

* **Segmentación inteligente de campañas**: Al conectar el ERP con las redes sociales, puedes usar el historial real de compras de tus clientes (datos alojados en tu ERP) para diseñar anuncios hiperespecíficos en Facebook o LinkedIn Ads orientados a la recompra o al cross-selling. [1]
* **Cumplimiento y logística eficientes**: Al estar integrado al ERP, el almacén recibe la orden de empaque segundos después de que el cliente pagó en el sitio web. [3]
* **Visibilidad financiera absoluta**: Los ingresos de las ventas online se vinculan directamente con los módulos de contabilidad y flujo de caja del negocio de forma automática. [3]
* **Trazabilidad del ciclo de vida del cliente**: Cada contacto queda indexado, permitiendo reactivar compradores dormidos y premiar la fidelidad de reposteros y comerciantes mayoristas.

---

## 🔁 Ciclo de Marketing Automation & Lead Nurturing

Para maximizar el retorno de inversión de la atracción en redes sociales, el pipeline se conecta con un motor de automatización de marketing continuo de 7 etapas:

1. **Construir Listas Segmentadas (Build Targeted Lists)**: Creación de audiencias basadas en perfil comercial (ej: Reposteros de General Roca, Gastronómicos de Neuquén, Comercios Mayoristas de Polietileno).
2. **Ejecutar Campañas (Execute Campaign)**: Lanzamiento coordinado en Instagram Ads, mensajes directos ManyChat y WhatsApp Business API con ofertas de temporada.
3. **Medir Comportamiento (Measure Behaviour)**: Detección en tiempo real de clics en productos, carritos abandonados e interacciones con el bot web.
4. **Segmentar y Puntuar Prospectos (Segment & Score Leads)**: Asignación automática de puntaje (Lead Scoring). Por ejemplo: +20 pts por consultar lista mayorista, +30 pts por iniciar checkout.
5. **Enrutar Prospectos Calificados al CRM / ERP (Route to CRM)**: Leads con alta intención de compra se asignan al vendedor de la sucursal más cercana para cierre consultivo.
6. **Mover Prospectos Tibios a Ciclo de Nutrición (Move to Nurture Cycle)**: Prospectos que aún no deciden su compra reciben cadencias automatizadas de contenido educativo y testimonios.
7. **Analizar Rendimiento Comercial (Analyse Sales Performance)**: El ERP consolida el retorno de inversión publicitaria (ROAS) y la tasa de recompra mensual.

---

## ⚡ Flujo Automatizado de Reactivación & Win-Back

El sistema incluye una regla de reactivación desatendida para no perder ningún prospecto:

* **Paso 1 (Captura)**: El cliente deja su contacto o consulta por DM en Instagram.
* **Paso 2 (Tagging)**: Se asigna etiqueta según la categoría de interés (\`#reposteria\`, \`#descartables\`, \`#polietileno\`).
* **Paso 3 (Disparo Inmediato)**: Envío automático de catálogo PDF interactivo y enlace a la tienda online.
* **Paso 4 (Evaluación de Interacción - Espera de 48 hs)**:
  - **Si hizo clic en el enlace**: Se asigna etiqueta \`#interes-activo\` y se envía cupón de envío bonificado para la sucursal correspondiente.
  - **Si NO hizo clic**: Se dispara recordatorio con asunto alternativo. Si persiste la inactividad, pasa a la lista de **Campaña de Reconquista (Win-Back Campaign)** con ofertas especiales por bulto cerrado.
    `
  },
  {
    id: 'manual-modulos-backend',
    category: 'backend',
    categoryLabel: '04. Módulos Backend & ERP',
    title: 'Manual de Uso de los 13 Módulos del Backend & ERP Koala',
    subtitle: 'Guía Operativa Paso a Paso para Operadores, Logística, Facturación y Sistemas',
    badge: 'Manual Oficial',
    lastUpdated: 'Septiembre 2026',
    readTime: '12 min',
    summary: 'Instrucciones operativas detalladas para utilizar cada módulo del backend Koala: Salud ERP, MCP Server v1.0, Analytics, Inventario, Traspasos Ruta 22, Precios, Cotizaciones, Facturación AFIP, Personal RBAC, Configuración, Cron, Tester y Social Commerce.',
    content: `
# Manual Operativo del Backend & ERP — Koala Lo Tiene (LP SRL)
**Guía de Procedimientos para la Gestión Unificada de Operaciones, Inventario y Facturación**

Este manual detalla el funcionamiento, los procedimientos operativos y las buenas prácticas para cada uno de los 13 módulos que integran el backend de Koala Lo Tiene.

---

## 1. 🟢 Módulo: Salud & Sincronización ERP (Sync Health)
* **Objetivo**: Monitorear en tiempo real la conectividad con el Gateway ERP (ICXN / Tango), la latencia de respuesta y la recepción de eventos vía webhooks.
* **Indicadores Principales**:
  - **Estado del Gateway**: Muestra si el servidor central responde (\`OPERATIVO\` / \`DEGRADADO\` / \`OFFLINE\`).
  - **Latencia**: Tiempo de respuesta de la API en milisegundos (objetivo: < 80 ms).
  - **Webhooks Recibidos**: Contador de eventos de actualización transmitidos hoy.
* **Procedimiento Operativo**:
  1. Ingresar a la pestaña **Salud & Sync ERP**.
  2. Verificar que los tres endpoints principales (\`/inventory\`, \`/orders\`, \`/prices\`) reporten estado verde (\`ONLINE\`).
  3. En caso de fallas o demoras en la red, presionar el botón **Forzar Sincronización Inmediata** para sincronizar el stock de ambas sucursales.
  4. Revisar la tabla de **Eventos de Webhooks Recientes** para auditar que las órdenes web hayan sido aceptadas por el ERP.

---

## 2. 🤖 Módulo: Servidor MCP Protocol v1.0 (Model Context Protocol)
* **Objetivo**: Exponer las herramientas seguras del ERP a los modelos de inteligencia artificial (Asistente Web, Bot de WhatsApp y ManyChat) para responder sin alucinaciones.
* **Herramientas Disponibles (Tools)**:
  - \`check_stock\`: Consulta existencias reales en DEP-01 (Roca) y DEP-02 (Neuquén).
  - \`query_price\`: Devuelve precio minorista y mayorista actualizado al instante.
  - \`reserve_stock\`: Genera bloqueo atómico temporal de 15 minutos en checkout.
  - \`branch_catalog\`: Filtra artículos disponibles por sucursal y categoría.
* **Procedimiento Operativo**:
  - El servidor opera de forma desatendida. Para verificar su salud, ingresar a la pestaña **MCP Protocol** y comprobar que el estado sea \`LISTENING (Port 3000 / RPC 2.0)\`.
  - Si un operador necesita validar una consulta de IA, puede ejecutar una prueba de herramientas directamente desde el panel de inspección.

---

## 3. 📊 Módulo: Dashboard de Analíticas & KPIs Comerciales
* **Objetivo**: Proveer métricas ejecutivas de ventas, demanda insatisfecha, rotación de artículos y comportamiento por sucursal.
* **Procedimiento Operativo**:
  - Monitorear el **Total Facturado Hoy**, el **Ticket Promedio** y las **Cotizaciones en Espera**.
  - Comparar el rendimiento entre **Casa Central General Roca** y **Salón Neuquén Capital**.
  - Identificar los 5 productos más vendidos del mes para coordinar pedidos de reposición con la fábrica de polietileno.

---

## 4. 📦 Módulo: Control de Inventario & Almacenes Multi-Sucursal
* **Objetivo**: Controlar las existencias físicas y reservas temporales en **DEP-01 (General Roca)** y **DEP-02 (Neuquén Capital)**.
* **Procedimiento Operativo**:
  1. Utilizar la barra de búsqueda para filtrar por SKU, código ERP o descripción del artículo.
  2. Observar las columnas de stock disponible y unidades bloqueadas por reserva web.
  3. Para realizar un ajuste manual por conteo físico o merma, hacer clic en el botón **Ajustar Stock**, ingresar la nueva cantidad y seleccionar la sucursal de destino.
  4. Si un artículo alcanza el umbral de stock crítico, el sistema emitirá una alerta visual automática para reabastecimiento.

---

## 5. 🚚 Módulo: Traspasos de Stock Inter-Sucursales (Ruta 22)
* **Objetivo**: Gestionar el envío de mercadería entre la planta de General Roca y el salón comercial de Neuquén Capital a través de la Ruta Nacional 22.
* **Estados del Traspaso**:
  - \`preparando\`: Mercadería siendo embalada en el depósito de origen.
  - \`en_transito\`: Despachada y en viaje en el furgón de logística.
  - \`recibido\`: Mercadería recepcionada y cargada en el inventario de destino.
* **Procedimiento Operativo**:
  1. Hacer clic en **Nuevo Traspaso Inter-Sucursales**.
  2. Seleccionar sucursal de origen (ej: Roca DEP-01), sucursal destino (Neuquén DEP-02), SKU y cantidad de unidades.
  3. Ingresar las notas de despacho (ej: *"Chofer: Remito 0004-9821, furgón Renault Master"*).
  4. Cuando el transporte arribe a destino, el operador de Neuquén debe cambiar el estado a **Recibido**; el sistema sumará automáticamente el stock al depósito local.

---

## 6. 🏷️ Módulo: Ajustes Masivos de Precios & Importador CSV
* **Objetivo**: Aplicar variaciones de costos de polietileno y descartables en segundos, tanto en lista minorista como mayorista.
* **Procedimiento Operativo**:
  1. **Ajuste Porcentual Rápido**: Ingresar el porcentaje deseado (ej: \`+8.5%\`), seleccionar si aplica a Minorista, Mayorista o Ambas listas, y pulsar **Aplicar Incremento**.
  2. **Exportación a CSV**: Hacer clic en **Descargar Catálogo CSV** para obtener la planilla compatible con Microsoft Excel y Tango Gestión.
  3. **Importación Masiva**: Arrastrar un archivo CSV con las columnas \`sku, precio_minorista, precio_mayorista, stock_roca, stock_neuquen\` y confirmar la sincronización.

---

## 7. 📑 Módulo: Cotizaciones & Presupuestador Digital
* **Objetivo**: Administrar presupuestos de clientes mayoristas, reposterías, eventos y entidades públicas generados desde la web o WhatsApp.
* **Procedimiento Operativo**:
  1. Revisar la bandeja de cotizaciones con estado \`pendiente\`.
  2. Hacer clic en **Ver Detalle** para examinar los artículos solicitados y datos del cliente.
  3. Aplicar descuentos comerciales o bonificaciones por volumen si corresponde.
  4. Hacer clic en **Aprobar y Emitir Factura** para enviar la orden al módulo de facturación electrónica.

---

## 8. 🧾 Módulo: Facturación Electrónica AFIP & Comprobantes ERP
* **Objetivo**: Emitir Facturas A, B y Remitos R oficiales autorizados por la AFIP con CAE (Código de Autorización Electrónico) en línea.
* **Procedimiento Operativo**:
  1. Seleccionar la orden aprobada o ingresar a **Emitir Comprobante Nuevo**.
  2. Seleccionar tipo de comprobante: **Factura A** (para responsables inscriptos con CUIT), **Factura B** (consumidor final) o **Remito R** (traslado de mercadería).
  3. Verificar discriminación del IVA (21%) y pulsar **Solicitar CAE a AFIP**.
  4. Una vez autorizado, se genera el número de comprobante oficial con código QR y opción de impresión en formato ticket o PDF A4.

---

## 9. 👥 Módulo: Gestión de Personal & Permisos RBAC
* **Objetivo**: Administrar las cuentas de empleados, contraseñas y niveles de acceso a las distintas áreas del sistema.
* **Roles Definidos**:
  - \`admin\` (Gerencia): Acceso total a finanzas, personal, ERP y configuraciones.
  - \`ventas\` (Vendedores): Cotizaciones, inventario, facturación y social commerce.
  - \`deposito\` (Logística): Control de stock, inventario y traspasos Ruta 22.
  - \`facturacion\` (Administración): Facturación AFIP, listas de precios y cuentas corrientes.
  - \`backend\` (Soporte Clientum): Monitor de sync, webhooks, cron, MCP, tester de APIs y parámetros ERP.
* **Procedimiento Operativo**:
  - Para dar de alta un usuario: Clic en **Registrar Nuevo Empleado**, completar nombre, correo (\`@koalalotiene.com.ar\` o \`@clientum.com.ar\`), contraseña inicial, rol asignado y sucursal.
  - Para revocar acceso temporal: Pulsar el botón de alternancia en el estado de la cuenta (\`Activo\` / \`Inactivo\`).

---

## 10. ⚙️ Módulo: Configuración del Sistema ERP & Endpoints
* **Objetivo**: Configurar las credenciales de enlace entre Koala Lo Tiene y el servidor de gestión empresarial.
* **Procedimiento Operativo**:
  1. Seleccionar el tipo de sistema conectado (ICXN ERP, Tango Software, Bejerman, SAP o Custom REST API).
  2. Ingresar la URL base del Gateway y el Token Bearer de seguridad.
  3. Configurar los identificadores de punto de venta (\`DEP-01 Roca\` y \`DEP-02 Neuquén\`).
  4. Seleccionar el modo de operación: **Sandbox (Pruebas)** para verificar flujos sin impacto contable o **Producción** para operaciones reales.
  5. Presionar **Guardar Configuración ERP**.

---

## 11. ⏱️ Módulo: Automatización Cron & Tareas Desatendidas
* **Objetivo**: Programar la ejecución automática de sincronizaciones periódicas de stock y actualización de costos de resinas.
* **Procedimiento Operativo**:
  - Visualizar la lista de tareas programadas (ej: sincronización cada 15 minutos, depuración de carritos abandonados a la medianoche).
  - Para forzar la ejecución de un cron específico fuera de hora, pulsar el icono **Ejecutar Ahora**.
  - Consultar el **Registro Histórico de Ejecución (Cron Logs)** para auditar códigos de estado HTTP y tiempo total de ejecución.

---

## 12. 🔌 Módulo: Tester API REST Interactivo
* **Objetivo**: Banco de pruebas para que el equipo de soporte de Clientum o los programadores del ERP testen llamadas HTTP en vivo.
* **Procedimiento Operativo**:
  1. Seleccionar método HTTP (\`GET\`, \`POST\`, \`PUT\`, \`PATCH\`) y endpoint a evaluar.
  2. Editar el cuerpo de la petición (JSON Payload) si es necesario.
  3. Hacer clic en **Enviar Petición (Send Request)**.
  4. Evaluar la respuesta devuelta: código HTTP (200 OK, 201 Created), cabeceras y tiempo de respuesta en ms.

---

## 13. 📱 Módulo: Social Commerce Hub & Flujos ManyChat
* **Objetivo**: Vincular el feed oficial de Instagram (@koalalotiene) con respuestas automáticas por palabras clave y links transaccionales.
* **Procedimiento Operativo**:
  1. Revisar las publicaciones activas del feed de Instagram sincronizado.
  2. Asignar etiquetas de producto y palabras clave de activación (ej: si el usuario comenta *"PRECIO"*, el bot envía el enlace directo al producto en el e-commerce).
  3. Monitorear los leads generados y verificar que el píxel registre el evento de conversión en la tienda online.
    `
  },
  {
    id: 'doc-modulo-salud-sync',
    category: 'backend',
    categoryLabel: '04. Módulos Backend & ERP',
    title: 'Guía Rápida — Módulo 1: Salud & Sincronización ERP',
    subtitle: 'Monitoreo de Gateway, Webhooks y Diagnóstico de Conectividad',
    badge: 'Ficha Técnica',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    summary: 'Instrucciones para operadores sobre cómo interpretar el monitor de latencia, auditar webhooks entrantes y resolver incidentes de conectividad con el sistema de gestión.',
    content: `
# Ficha Técnica: Salud & Sincronización ERP
*Módulo de Monitoreo de Infraestructura y Enlace Transaccional*

### 1. Indicadores de Salud del Gateway
* **Verde (Latencia < 100 ms)**: Conexión óptima. Las reservas atómicas y las órdenes web se procesan en tiempo real sin retardo.
* **Amarillo (Latencia 100 - 300 ms)**: Congestión temporal en el enlace o alto volumen de transacciones simultáneas.
* **Rojo (Offline / Timeout)**: Sin comunicación con el servidor central del ERP. El e-commerce entra en modo preventivo usando el último inventario local cacheado.

### 2. Acciones de Contingencia
1. Si un vendedor en mostrador no ve reflejada una venta web reciente, presione **Forzar Sincronización Inmediata**.
2. Verifique en la lista de webhooks si el evento correspondiente a la orden tiene código de respuesta \`200 OK\`.
3. Si el webhook arroja error \`503 Service Unavailable\`, el sistema reintentará automáticamente a los 60 segundos con backoff exponencial.
    `
  },
  {
    id: 'doc-modulo-mcp-protocol',
    category: 'backend',
    categoryLabel: '04. Módulos Backend & ERP',
    title: 'Guía Rápida — Módulo 2: Servidor MCP Protocol v1.0',
    subtitle: 'Integración de Herramientas de IA para Inventario y Precios en Vivo',
    badge: 'Ficha Técnica',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    summary: 'Cómo funciona la arquitectura Model Context Protocol (MCP) para conectar modelos LLM con las bases de datos de Koala Lo Tiene sin alucinaciones de precios ni stock.',
    content: `
# Ficha Técnica: Servidor MCP Protocol v1.0
*Estándar de Interoperabilidad para Agentes de IA en Koala Lo Tiene*

### ¿Por qué MCP y no un bot tradicional?
Los bots de preguntas frecuentes tradicionales inventan datos cuando un cliente pregunta por medidas o stock específico. Con **MCP (Model Context Protocol)**, el modelo de inteligencia artificial no memoriza el catálogo, sino que dispone de un conjunto de herramientas estandarizadas que invoca en milisegundos:

\`\`\`json
// Ejemplo de invocación de herramienta check_stock
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "check_stock",
    "arguments": {
      "sku": "POL-BOL-CAM-4050",
      "branchId": "roca"
    }
  }
}
\`\`\`

### Beneficios para Koala:
* **Cero Alucinaciones**: El bot jamás confirma stock si el ERP tiene 0 unidades en esa sucursal.
* **Reserva en el Chat**: El cliente puede pedir reservar un paquete de bolsas o descartables directamente desde WhatsApp.
* **Aislamiento Seguro**: El modelo de IA no tiene acceso a las tablas maestras ni a los costos internos del ERP, solo a las herramientas públicas autorizadas.
    `
  }
];
