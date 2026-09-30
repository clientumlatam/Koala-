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
    title: 'Propuesta Comercial — Cuadro Comparativo (3 Opciones)',
    subtitle: 'Matriz de Inversión y Comparativa de Alternativas (LP SRL)',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Matriz comparativa de las 3 alternativas de inversión para Koala Cotillón (LP SRL — Mikhail Murekian): Opción 1 Inicial ($1.120.000), Opción 2 Intermedia ($2.785.000) y Opción 3 Mercado Actual ($4.450.000).',
    content: `
# Propuesta Comercial — Clientum × KOALA (Cuadro Comparativo)
**Plan de Transformación Digital Omnicanal — 3 Opciones de Inversión**
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
1. **Etapa 1 — E-commerce + Catálogo íntegro + SEO Orgánico (~15–17 días)**
2. **Etapa 2 — Integración con ERP (Reserva Atómica de Stock)**
3. **Etapa 3 — Bot Web + Bot WhatsApp con IA & Servidor MCP**

### Estructura de Inversión — Comparativa de 3 Alternativas

| Concepto / Etapa | Opción 1: Inicial (Base) | Opción 2: Intermedia (Medio) | Opción 3: Mercado Actual (Premium) | Condición Comercial |
| :--- | :--- | :--- | :--- | :--- |
| **Etapa 1 — E-commerce + SEO** | $ 518.000 | $ 1.334.000 | $ 2.150.000 | Pago al inicio |
| *(Abono Mensual Etapa 1)* | *$ 104.000 / $ 133.200* | *$ 242.000 / $ 296.600* | *$ 380.000 / $ 460.000* | Mensual |
| **Etapa 2 — Integración ERP** | $ 414.400 | $ 1.032.200 | $ 1.650.000 | A convenir según ERP |
| *(Abono Mensual Etapa 2)* | *$ 86.000 / $ 111.000* | *$ 203.000 / $ 250.500* | *$ 320.000 / $ 390.000* | Mensual |
| **Etapa 3 — Bots Web + WhatsApp** | $ 187.600 | $ 668.800 | $ 1.150.000 | Al inicio de la etapa |
| *(Abono Mensual Etapa 3)* | *$ 77.000 / $ 66.600* | *$ 183.500 / $ 208.300* | *$ 290.000 / $ 350.000* | Mensual |
| **PACK COMPLETO SUGERIDO** | **$ 1.120.000** | **$ 2.785.000** | **$ 4.450.000** | **Anticipo 50% al iniciar** |
| *(Abono Mensual Pack Completo)* | **$ 267.000 / $ 310.800** | **$ 578.500 / $ 680.400** | **$ 890.000 / $ 1.050.000** | **Mensual** |

#### Desglose de Opciones de Inversión:
1. **Opción 1 — Inversión Inicial (Valores Base Históricos)**:
   - **Setup Pack Completo**: **$ 1.120.000 ARS**
   - **Mantenimiento Mensual**: **$ 267.000 ARS** (Soporte Básico) / **$ 310.800 ARS** (Soporte SLA Prioritario).
   - *Ideal para arranque ágil con presupuesto reducido.*

2. **Opción 2 — Inversión Intermedia (Valores Equilibrados)**:
   - **Setup Pack Completo**: **$ 2.785.000 ARS**
   - **Mantenimiento Mensual**: **$ 578.500 ARS** (Soporte Estándar) / **$ 680.400 ARS** (Soporte Proactivo con Monitoreo).
   - *Punto medio óptimo equilibrando inversión inicial y profundidad de alcance.*

3. **Opción 3 — Mercado Actual (Escala Completa & Módulos Avanzados)**:
   - **Setup Pack Completo**: **$ 4.450.000 ARS**
   - **Mantenimiento Mensual**: **$ 890.000 ARS** (Mantenimiento Integral) / **$ 1.050.000 ARS** (Soporte Premium 24/7 con Servidor MCP Dedicado).
   - *Infraestructura completa de alto rendimiento para máxima demanda regional.*

*Validez: 15 días corridos. Los valores no incluyen IVA.*

---

## ¿Por qué Clientum?
* **Precios en ARS y soporte local**: Equipo basado en General Roca (Patagonia). Soporte y mantenimiento garantizado 365 días, respuesta menor a 4 horas.
* **Tecnología propia y flexible**: Sin dependencia de plataformas extranjeras. Stack probado: WhatsApp API, agentes IA, sincronización ERP y e-commerce de alta velocidad.
* **Stack probado en producción**: WhatsApp API oficial (Cloud API Meta), agentes IA con MCP, sincronización ERP-ecommerce, WooCommerce/PrestaShop con integraciones propias.
* **Trazabilidad y control**: Panel de administración con monitor de sincronización ERP, hub de stock, API tester y auditoría completa de todas las operaciones.
`
  },
  {
    id: 'propuesta-1-inicial',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Propuesta 1 — Plan Inicial ($ 1.120.000 ARS)',
    subtitle: 'Esquema de Arranque Ágil en 3 Etapas con Inversión Base',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Propuesta comercial independiente orientada al presupuesto de arranque base ($ 1.120.000 ARS Pack Completo), priorizando tiempo de salida rápido e inversión inicial accesible.',
    content: `
# Propuesta Comercial 1 — Plan Inicial (Base)
**Clientum × KOALA Cotillón & Descartables (LP SRL)**
*General Roca, Río Negro y Neuquén Capital · Septiembre 2026*

---

## Resumen del Plan Inicial
Esta propuesta está diseñada para un **despliegue rápido y eficiente** con foco en la relación costo-beneficio de arranque. Permite poner en funcionamiento el canal e-commerce, el posicionamiento orgánico en el Alto Valle y la infraestructura básica para integraciones.

### Estructura de Inversión — Opción 1: Inicial

| Concepto / Etapa | Setup (ARS) | Mantenimiento Mensual (ARS) | Condición Comercial |
| :--- | :--- | :--- | :--- |
| **Etapa 1 — E-commerce + SEO Orgánico** | $ 518.000 | $ 104.000 / $ 133.200 | Pago al inicio |
| **Etapa 2 — Integración con ERP** | $ 414.400 | $ 86.000 / $ 111.000 | A convenir según ERP |
| **Etapa 3 — Bot Web + WhatsApp con IA** | $ 187.600 | $ 77.000 / $ 66.600 | Al inicio de la etapa |
| **PACK COMPLETO (3 ETAPAS)** | **$ 1.120.000** | **$ 267.000 / $ 310.800** | **Anticipo 50% al iniciar** |

#### Características Incluidas en la Opción 1:
- **E-commerce Básico / Intermedio**: Carga de categorías principales de cotillón, descartables, repostería y polietileno.
- **SEO Geolocalizado**: Optimización inicial para General Roca y Neuquén.
- **Reserva de Stock**: Protocolo básico de prevención de sobreventas.
- **Abono de Mantenimiento**: $ 267.000/mes (Soporte Estándar) o $ 310.800/mes (Soporte con SLA Prioritario).

*Validez: 15 días corridos. Los valores no incluyen IVA.*
`
  },
  {
    id: 'propuesta-2-intermedia',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Propuesta 2 — Plan Intermedio ($ 2.785.000 ARS)',
    subtitle: 'Esquema Equilibrado Recomendado (Valores Medio)',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Propuesta comercial independiente con valores en el punto medio exacto ($ 2.785.000 ARS Pack Completo). Equilibra inversión inicial con capacidades extendidas de automatización.',
    content: `
# Propuesta Comercial 2 — Plan Intermedio (Punto Medio) ⭐
**Clientum × KOALA Cotillón & Descartables (LP SRL)**
*General Roca, Río Negro y Neuquén Capital · Septiembre 2026*

---

## Resumen del Plan Intermedio (Recomendado)
Esta propuesta representa el **punto medio óptimo de inversión**. Amplía la capacidad de carga del catálogo completo de productos de Koala, acelera la sincronización de stock con el ERP y añade monitoreo proactivo para el bot de WhatsApp.

### Estructura de Inversión — Opción 2: Intermedia (Medio)

| Concepto / Etapa | Setup (ARS) | Mantenimiento Mensual (ARS) | Condición Comercial |
| :--- | :--- | :--- | :--- |
| **Etapa 1 — E-commerce + SEO Avanzado** | $ 1.334.000 | $ 242.000 / $ 296.600 | Pago al inicio |
| **Etapa 2 — Integración ERP Bidireccional** | $ 1.032.200 | $ 203.000 / $ 250.500 | A convenir según ERP |
| **Etapa 3 — Bot Web + WhatsApp + MCP** | $ 668.800 | $ 183.500 / $ 208.300 | Al inicio de la etapa |
| **PACK COMPLETO (3 ETAPAS)** | **$ 2.785.000** | **$ 578.500 / $ 680.400** | **Anticipo 50% al iniciar** |

#### Características Incluidas en la Opción 2:
- **Catálogo Íntegro Extendido**: Sincronización continua de miles de SKUs de descartables, polietileno y cotillón.
- **Reserva Atómica Temporal**: Bloqueo de stock en tiempo real (15 min) para evitar quiebres mostrador vs. web.
- **Asistente IA WhatsApp con MCP**: Consulta de precios y stock en vivo sin alucinaciones.
- **Abono de Mantenimiento**: $ 578.500/mes (Soporte Estándar) o $ 680.400/mes (Soporte Proactivo Integral).

*Validez: 15 días corridos. Los valores no incluyen IVA.*
`
  },
  {
    id: 'propuesta-3-mercado',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Propuesta 3 — Plan Mercado Actual ($ 4.450.000 ARS)',
    subtitle: 'Esquema de Escala Completa con Módulos Avanzados 24/7',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Propuesta comercial independiente basada en tarifas actuales de mercado completo ($ 4.450.000 ARS Pack Completo), con infraestructura dedicada y máxima disponibilidad.',
    content: `
# Propuesta Comercial 3 — Plan Mercado Actual (Premium)
**Clientum × KOALA Cotillón & Descartables (LP SRL)**
*General Roca, Río Negro y Neuquén Capital · Septiembre 2026*

---

## Resumen del Plan Mercado Actual (Escala Completa)
Esta propuesta contempla la **implementación de máxima capacidad tecnológica**, orientada a negocios con alto volumen de transacciones simultáneas y necesidad de disponibilidad crítica 24/7.

### Estructura de Inversión — Opción 3: Mercado Actual (Premium)

| Concepto / Etapa | Setup (ARS) | Mantenimiento Mensual (ARS) | Condición Comercial |
| :--- | :--- | :--- | :--- |
| **Etapa 1 — E-commerce + SEO Full Escala** | $ 2.150.000 | $ 380.000 / $ 460.000 | Pago al inicio |
| **Etapa 2 — Integración ERP Atómica 100%** | $ 1.650.000 | $ 320.000 / $ 390.000 | A convenir según ERP |
| **Etapa 3 — Bot Web + WhatsApp + MCP Dedicado** | $ 1.150.000 | $ 290.000 / $ 350.000 | Al inicio de la etapa |
| **PACK COMPLETO (3 ETAPAS)** | **$ 4.450.000** | **$ 890.000 / $ 1.050.000** | **Anticipo 50% al iniciar** |

#### Características Incluidas en la Opción 3:
- **Infraestructura de Alta Disponibilidad**: Servidor propio MCP dedicado para consulta instantánea de stock.
- **Atención Multicanal Automatizada**: Integración de WhatsApp Business API, Instagram Direct y Facebook Messenger.
- **SLA Garantizado 24/7**: Equipo técnico de respuesta inmediata (< 2 horas) y mantenimiento continuo.
- **Abono de Mantenimiento**: $ 890.000/mes (Soporte Premium) o $ 1.050.000/mes (Soporte Misión Crítica 24/7).

*Validez: 15 días corridos. Los valores no incluyen IVA.*
`
  },
  {
    id: 'email-mikhail',
    category: 'comercial',
    categoryLabel: '01. Comercial & Propuestas',
    title: 'Plantilla de Email — Mikhail Murekian (LP SRL)',
    subtitle: 'Correo formal de presentación de la propuesta de 3 etapas',
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
      "price": 14500,
      "wholesalePrice": 11800,
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
    id: 'respuestas-consultas-milton',
    category: 'tecnico',
    categoryLabel: '02. Respuestas a Consultas de Milton (Tienda Web Koalas)',
    title: 'Respuestas a Consultas de Milton — Tienda Web Koalas',
    subtitle: 'Stock en 0s, Logística de Fletes & Zonas, Chatbot Híbrido y Captación Local Google',
    lastUpdated: 'Septiembre 2026',
    readTime: '6 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Respuestas organizadas y detalladas para responder a las 6 consultas clave de Milton sobre la propuesta de la tienda web de Koalas: actualización de stock en 0 seg, impacto del ingreso de mercadería, cálculo de flete y entregas sin cargo, esquema híbrido Chatbot vs WhatsApp, captación de clientes más allá de redes y delimitación de ventas por radio geográfico.',
    copyableText: `Respuestas Organizadas para Milton — Tienda Web Koalas:

1. ACTUALIZACIÓN DEL STOCK EN LA PÁGINA:
El stock se actualiza de forma automática e instantánea (en 0 segundos) en la base de datos central cada vez que un cliente confirma una compra. Si el negocio realiza ventas por mostrador o canales externos, la conexión por API/Webhooks entre el sistema de gestión (ERP/depósito) y la tienda web sincroniza las existencias de manera inmediata.

2. IMPACTO DEL INGRESO DE MERCADERÍA AL STOCK:
El impacto es inmediato en cuestión de segundos en el momento exacto en que el encargado de depósito o compras registra la entrada cargando cantidades, importando el remito o escaneando el código de barras/QR. Los productos que figuraban como agotados vuelven a mostrarse automáticamente como disponibles para la compra online sin requerir acciones manuales adicionales.

3. CÁLCULO DEL COSTO DE FLETE Y ENTREGAS SIN CARGO:
• Se calcula mediante operadores logísticos integrados (como Andreani, Correo Argentino, OCA, etc.) ingresando el Código Postal en el carrito para consultar la API de transporte según peso, volumen y distancia kilométrica, o mediante logística propia con tarifas prefijadas por zonas o radios en kilómetros (ej. 5 km o 10 km).
• Las entregas sin cargo se pueden configurar por cercanía geográfica (ej. radio de hasta 3 km), por monto mínimo de compra para elevar el ticket promedio, o mediante retiro en punto de entrega (Pick-up) sin costo.

4. CONSULTAS TÉCNICAS (CHATBOT VS. WHATSAPP):
Se implementa un esquema híbrido que cuenta con un chatbot web operativo 24/7 para responder preguntas frecuentes y dudas técnicas estándar, además de incluir un botón en cada ficha de producto para derivar directamente a WhatsApp con un mensaje preconfigurado del modelo consultado, o transferir la conversación desde el bot si el cliente requiere atención personalizada.

5. CAPTACIÓN DE CLIENTES MÁS ALLÁ DE LAS REDES SOCIALES:
Se logra a través de búsqueda orgánica en Google (SEO) optimizada para motores de búsqueda, Google Mi Negocio / Google Maps para búsquedas locales, anuncios en Google Ads y Google Shopping, campañas de email y WhatsApp a clientes recurrentes, y códigos QR físicos en el empaque para incentivar recompras.

6. BÚSQUEDA EN NAVEGADORES CON RADIO DE VENTAS DELIMITADO:
Sí, es totalmente posible. Se logra configurando el área de servicio específica en la ficha de Google para priorizar resultados de cercanía, mediante publicidad geosegmentada por radio en kilómetros en Google Ads (para que solo vean los anuncios las personas dentro de la zona de cobertura), y utilizando un validador de Código Postal directamente en la web.`,
    content: `
# Respuestas a las Consultas de Milton — Tienda Web Koalas
**Documento Técnico & Operativo para Milton (LP SRL / Koala Lo Tiene)**
*Septiembre 2026 · Clientum × Koalas*

---

### Resumen Ejecutivo
A continuación se presenta la información organizada y detallada para responder con solidez a cada una de las consultas planteadas por **Milton** acerca del funcionamiento técnico, la sincronización de inventarios, la logística y la estrategia de captación comercial de la tienda web de **Koalas**.

---

### 1. Actualización del Stock en la Página
* **Velocidad y Tiempo Real**: El stock se actualiza de forma automática e **instantánea (en 0 segundos)** en la base de datos central cada vez que un cliente confirma y abona una compra en la plataforma web.
* **Integración Omnicanal (Mostrador vs. Online)**: Si el negocio realiza ventas presenciales por mostrador en General Roca (Av. Roca 1350) o Neuquén Capital (Mitre 678), o a través de canales externos (Mercado Libre, distribuidores), la conexión bidireccional por **API/Webhooks** entre el sistema de gestión (**ICXN ERP / Depósito**) y la tienda web sincroniza las existencias de manera inmediata.
* **Prevención de Sobreventas**: Se activa el bloqueo de reserva atómica temporal al entrar en checkout, imposibilitando que dos compradores adquieran la misma última unidad.

---

### 2. Impacto del Ingreso de Mercadería al Stock
* **Impacto en Segundos**: El impacto es inmediato en cuestión de segundos en el momento exacto en que el encargado de depósito o compras registra la entrada de mercadería.
* **Mecanismos de Carga Compatibles**:
  - Carga manual de cantidades en sistema ERP.
  - Importación automática de remitos electrónicos o archivos XML/Excel de proveedores.
  - Escaneo de código de barras / QR físico con pistola lectora o celular en la recepción de pallets.
* **Habilitación Automática**: Los productos que figuraban con etiqueta de *"Agotado"* o sin stock en la tienda vuelven a mostrarse automáticamente como disponibles para la compra online, sin requerir ninguna acción manual adicional ni recarga de página por parte de los administradores.

---

### 3. Cálculo del Costo de Flete y Entregas Sin Cargo
* **Cálculo Dinámico por Operadores Logísticos**:
  - Integración nativa por API con empresas de correo y transporte (Andreani, Correo Argentino, OCA, Encomiendas de Línea).
  - El cliente ingresa su **Código Postal** en el carrito; la API calcula el valor exacto en tiempo real según peso, volumen cúbico y distancia kilométrica.
* **Logística Propia con Tarifas Prefijadas**:
  - Tarifas escalonadas según zonas o radios en kilómetros (ej. Zona 1: Radio 5 km en General Roca o Neuquén Centro; Zona 2: Radio 10 km a Allen, Cervantes, Cipolletti, Plottier).
* **Entregas Sin Cargo (Envío Gratis) & Pick-up**:
  - **Por cercanía geográfica**: Configuración de entrega bonificada para clientes ubicados en un radio de hasta 3 km de la sucursal de despacho.
  - **Por ticket mínimo**: Configuración de umbral de compra (ej. compras superiores a $45.000) para incentivar el aumento del ticket promedio.
  - **Retiro en Tienda (Pick-up)**: Opción gratuita 100% disponible tanto en Casa Central (Av. Roca 1350) como en Neuquén (Mitre 678) con notificación de paquete listo para retirar.

---

### 4. Consultas Técnicas: Esquema Híbrido (Chatbot vs. WhatsApp)
* **Arquitectura Híbrida 24/7**:
  - **Chatbot Web Inteligente**: Operativo 24/7 en la tienda online para evacuar preguntas frecuentes, verificar stock disponible, orientar en micrones/medidas de polietileno, horarios de sucursal y costos estimados de envío.
  - **Botón Directo a WhatsApp por Producto**: Cada ficha de producto y el carrito incluyen un botón directo que abre una conversación de WhatsApp con un mensaje preconfigurado que indica el código de producto, nombre y sucursal consultada.
  - **Transferencia Fluida a Humano**: Si la consulta del cliente en el chatbot requiere atención técnica especializada o negociación mayorista, el bot transfiere la conversación automáticamente al WhatsApp del asesor comercial de la sucursal correspondiente.

---

### 5. Captación de Clientes Más Allá de las Redes Sociales
* **Búsqueda Orgánica en Google (SEO Local & E-Commerce)**: Optimización técnica on-page y Schema.org estructurado para posicionar en búsquedas clave ("bolsas de polietileno Roca", "descartables Neuquén", "cotillón mayorista Alto Valle").
* **Google Mi Negocio / Google Maps**: Fichas optimizadas con geolocalización, reseñas, fotos de sucursales, horarios actualizados y catálogo de productos visible en Google Search y Maps.
* **Publicidad en Google Ads & Google Shopping**: Campañas geolocalizadas que muestran los productos con foto y precio a usuarios que buscan activamente comprar en el Alto Valle en ese preciso momento.
* **Campañas de Recompra (Email & WhatsApp)**: Automatización de mensajes a clientes recurrentes (panaderías, rotiserías, comercios, reposteras) recordando reposición mensual.
* **Códigos QR Físicos en Empaque**: Incorporación de QR en las bolsas y cajas de entrega de Koalas ("Escaneá y repetí tu pedido con 10% OFF en la web"), transformando cada empaque físico en una recompra digital asegurada.

---

### 6. Búsqueda en Navegadores con Radio de Ventas Delimitado
* **¿Es posible?**: Sí, es totalmente viable y una de las principales ventajas de esta implementación.
* **Estrategia en 3 Niveles**:
  1. **Área de Servicio en Google**: Configuración del radio exacto de servicio en Google Business Profile para que el motor de búsqueda priorice los resultados de Koalas frente a búsquedas realizadas dentro del radio de influencia.
  2. **Google Ads Geosegmentado**: Campañas de anuncios delimitadas por radio en kilómetros (ej. radio de 15 km a la redonda de cada sucursal), garantizando que el 100% del presupuesto publicitario impacte exclusivamente a personas dentro de la zona de cobertura.
  3. **Validador de Código Postal en Web**: El carrito valida inmediatamente el código postal del visitante antes de proceder al pago, informándole la disponibilidad de entrega o coordinando envío especial si se encuentra fuera del radio habitual.
    `
  },
  {
    id: 'plan-implementacion-tiempos-koalas',
    category: 'comercial',
    categoryLabel: '01. Planificación & Tiempos (Koalas)',
    title: 'Planificación de Implementación y Tiempos para Koalas',
    subtitle: 'Requisitos Técnicos, Fases (10 Días Hábiles), Flujo Operativo y Requerimientos de Inicio',
    lastUpdated: 'Septiembre 2026',
    readTime: '6 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Plan detallado de puesta en marcha para Koalas: tiempo estimado de 2 a 5 / 10 días hábiles, integración ERP en 1 a 2 días, configuración logística en 1 día, flujo operativo en 6 pasos y requerimientos de inicio.',
    copyableText: `Planificación de Implementación y Tiempos para Koalas (Resumen Ejecutivo):

1. REQUISITOS TÉCNICOS Y PLAZOS DE PUESTA EN MARCHA:
• Tiempo estimado de implementación: El desarrollo, configuración y puesta a punto completa de la tienda web junto con sus integraciones operativas requiere un plazo estimado de 2 a 5 días hábiles, dependiendo de la complejidad del catálogo inicial (cronograma integral de 10 días hábiles para el lanzamiento público oficial).
• Integración del sistema de gestión (ERP/Depósito): La sincronización por API y Webhooks entre el stock central y la tienda web toma aproximadamente de 1 a 2 días hábiles de pruebas para garantizar que la actualización sea bidireccional y en tiempo real.
• Configuración logística y pasarelas de pago: La parametrización de operadores logísticos (Andreani, Correo Argentino, etc.), radios de entrega local y medios de pago se completa en 1 día hábil.

2. CRONOGRAMA DE ETAPAS (10 DÍAS HÁBILES):
• Etapa 1 (Días 1 a 3): Configuración inicial de la plataforma, diseño base, carga de categorías principales y vinculación de los medios de pago y envío.
• Etapa 2 (Días 4 a 8): Integración con el sistema de gestión/ERP o carga masiva de productos (según corresponda), configuración de radios de entrega/costos de flete y automatización del chatbot/WhatsApp.
• Etapa 3 (Días 9 a 10): Pruebas integrales de compra, validación de stock en tiempo real y lanzamiento oficial al público.

3. FLUJO OPERATIVO PASO A PASO:
1. Aprobación y Kick-off: Se confirma el proyecto y se definen los accesos al sistema de gestión actual y redes oficiales.
2. Desarrollo y Conexión de Stock: Se estructura la tienda web y se establece la conexión automática por API para la actualización de stock en tiempo real (0 segundos de demora tras una compra online o escaneo de ingreso en depósito).
3. Depósito y Carga de Mercadería: El personal de depósito carga remitos o escanea el ingreso; el impacto en la web es inmediato, reactivando productos agotados sin intervención manual.
4. Operativa de Compra y Envío: El cliente ingresa su Código Postal en el carrito para cotizar el flete automáticamente por distancia/peso, o el sistema aplica la tarifa fija según el radio en kilómetros delimitado o la regla de envío sin cargo establecida (por monto o cercanía).
5. Gestión Administrativa y Financiera: El equipo confirma la operación y el depósito prepara el paquete (con opción de generar etiquetas logísticas de forma automatizada).
6. Entrega al Cliente: El operador logístico o la cadetería propia despacha el producto, cerrando el ciclo comercial.

4. REQUERIMIENTOS PARA INICIAR (QUÉ NECESITAMOS DE USTEDES):
• Listado de Productos y Stock: Base de datos inicial (en formato Excel o conexión a su sistema actual) con detalle de artículos, precios, descripciones y stock inicial.
• Información Logística: Definición exacta de la ubicación del local/depósito central, radios de cobertura para entrega propia (si aplica) y tarifas o reglas de envío gratis.
• Accesos y Canales: Datos de acceso a la pasarela de pagos (Mercado Pago u otros), cuentas de correo asociadas y el número de WhatsApp oficial que se utilizará para la derivación de consultas técnicas.`,
    content: `
# Planificación de Implementación y Tiempos para Koalas
**Documento de Trabajo & Flujo Operativo para Milton y el Equipo de Ventas**
*Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*
*General Roca y Neuquén Capital · Septiembre 2026*

---

### Introducción
Para formalizar la propuesta y acelerar la toma de decisiones con el equipo directivo, comercial y operativo de **Koalas**, a continuación se detallan los requerimientos técnicos, los plazos estimados de puesta en marcha, el cronograma modular de trabajo y el flujo operativo paso a paso.

---

### 1. Requisitos Técnicos y Plazos de Puesta en Marcha

* **Tiempo estimado de implementación base:**
  El desarrollo, configuración y puesta a punto completa de la tienda web junto con sus integraciones operativas requiere un plazo estimado de **2 a 5 días hábiles**, dependiendo de la complejidad y volumen del catálogo inicial de artículos.

* **Integración del sistema de gestión (ERP / Depósito):**
  La sincronización por **API y Webhooks** entre el stock central y la tienda web toma aproximadamente de **1 a 2 días hábiles** de pruebas para garantizar que la actualización sea 100% bidireccional y en tiempo real.

* **Configuración logística y pasarelas de pago:**
  La parametrización de operadores logísticos (Andreani, Correo Argentino, OCA, etc.), radios de entrega local y medios de pago se completa en **1 día hábil**.

---

### 2. Fases del Proyecto y Cronograma de Trabajo (10 Días Hábiles)

Para un despliegue integral con pruebas completas de estrés y control de calidad, el proyecto se estructura en un cronograma de **10 días hábiles** a partir de la confirmación y entrega de los accesos iniciales:

| Etapa | Plazo | Actividades y Entregables Clave |
| :--- | :--- | :--- |
| **Etapa 1: Base & Pasarelas** | **Días 1 a 3** | Configuración inicial de la plataforma, diseño responsivo adaptado a la identidad de Koalas, estructura de categorías principales y vinculación de pasarelas de pago (Mercado Pago, tarjetas, transferencias) y medios de envío. |
| **Etapa 2: Integración ERP & Logística** | **Días 4 a 8** | Integración nativa con el sistema de gestión/ERP o carga masiva de productos (según corresponda), configuración de radios de entrega/costos de flete y automatización del chatbot/WhatsApp. |
| **Etapa 3: QA & Lanzamiento** | **Días 9 a 10** | Pruebas integrales de compra extremo a extremo, validación de stock en tiempo real (0 segundos) y lanzamiento oficial al público. |

---

### 3. Flujo Operativo Paso a Paso (Circuito Completo de la Operación)

El proceso operativo desde que se aprueba el proyecto hasta que el cliente final recibe su pedido sigue un flujo estructurado y predecible:

\`\`\`
[1. Aprobación & Kick-off]
          ↓
[2. Desarrollo & Conexión de Stock (0s)]
          ↓
[3. Depósito & Carga de Mercadería (Remitos/QR)]
          ↓
[4. Operativa de Compra & Cotización de Envío (CP/Radio)]
          ↓
[5. Gestión Administrativa & Etiquetas Logísticas]
          ↓
[6. Entrega al Cliente (Correo / Cadetería Propia)]
\`\`\`

1. **Aprobación y Kick-off:**
   Se confirma el proyecto y se definen los accesos al sistema de gestión actual, pasarelas de pago y canales oficiales de comunicación.

2. **Desarrollo y Conexión de Stock:**
   Se estructura la tienda web y se establece la conexión automática por API para la actualización de stock en tiempo real (**0 segundos de demora** tras una compra online o escaneo de ingreso en depósito).

3. **Depósito y Carga de Mercadería:**
   El personal de depósito carga remitos o escanea el ingreso de pallets; el impacto en la web es inmediato, reactivando productos agotados sin requerir ninguna intervención manual.

4. **Operativa de Compra y Envío:**
   El cliente ingresa su **Código Postal** en el carrito para cotizar el flete automáticamente por distancia/peso mediante la API de transporte, o el sistema aplica la tarifa fija según el radio en kilómetros delimitado o la regla de entrega sin cargo establecida (por monto o cercanía geográfica).

5. **Gestión Administrativa y Financiera:**
   El equipo administrativo confirma la operación validada automáticamente; el depósito prepara el paquete con opción de generar etiquetas logísticas de despacho de forma automatizada.

6. **Entrega al Cliente:**
   El operador logístico integrado o la cadetería propia despacha el producto, cerrando con éxito el ciclo comercial y enviando el seguimiento al cliente.

---

### 4. Requerimientos para Iniciar (Qué Necesitamos de Ustedes)

Para poder avanzar ágilmente con la estructuración técnica y acelerar los tiempos de desarrollo al máximo, requerimos contar con:

* 📋 **Listado de Productos y Stock:**
  Base de datos inicial (en formato Excel, CSV o credenciales de conexión al sistema ERP actual) con detalle de artículos, códigos/SKU, precios mayoristas y minoristas, descripciones y existencias por sucursal.

* 🚚 **Información Logística & Zonas:**
  Definición exacta de la ubicación del local y depósito central (General Roca / Neuquén), radios de cobertura para entrega propia en kilómetros (ej. 3 km, 5 km, 10 km) y tarifas o umbrales de compra para envíos sin cargo.

* 🔐 **Accesos y Canales Oficiales:**
  Datos de acceso a la pasarela de pagos (cuenta de Mercado Pago u otras), cuentas de correo asociadas para notificaciones de ventas y el número de WhatsApp oficial que se utilizará para la derivación directa de consultas comerciales y técnicas.
    `
  },
  {
    id: 'dns-migracion-cloudflare-koala',
    category: 'tecnico',
    categoryLabel: '02. Infraestructura & Dominio (koalalotiene.com.ar)',
    title: 'Migración DNS a Cloudflare & Vercel — koalalotiene.com.ar',
    subtitle: 'Tabla de Registros DNS, Correo ICXN, Delegación NIC.ar y Planilla de Seguimiento Excel',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Planilla técnica integral para la activación del dominio koalalotiene.com.ar: reemplazo de servidores en nic.ar por braelyn y bryce, CNAME de Vercel en DNS only, protección del tráfico SMTP de ICXN en mail y webmail, solicitud de DKIM y descarga de la hoja de cálculo Excel compilada.',
    copyableText: `Resumen de Zona DNS koalalotiene.com.ar para Cloudflare:

1. REGISTROS DNS A CARGAR EN CLOUDFLARE:
• Borrar: A y AAAA (@ y www) con IPs proxies viejas de Cloudflare.
• Agregar CNAME @ (raíz): 16bc395e55b20519.vercel-dns-017.com (DNS only - Gris)
• Agregar CNAME www: 16bc395e55b20519.vercel-dns-017.com (DNS only - Gris)
• Editar CNAME mail: icxn-lp.dvrdns.org (DNS only - Gris) [OBLIGATORIO para no romper recepción SMTP]
• Reemplazar CNAME webmail: icxn-lp.dvrdns.org (DNS only - Gris, a confirmar con ICXN)
• Dejar MX @: 10 mail.koalalotiene.com.ar (DNS only)
• Dejar TXT @: v=spf1 include:outbound.mailhop.org ?all
• Dejar TXT _dmarc: v=DMARC1; p=none; rua=mailto:soporte@icxn.com.ar
• Pedir y Cargar TXT DKIM: selector y clave provistos por soporte@icxn.com.ar

2. SERVIDORES DNS EN NIC.AR:
• Borrar: nelly.ns.cloudflare.com y zac.ns.cloudflare.com
• Asignar: braelyn.ns.cloudflare.com y bryce.ns.cloudflare.com
• Desactivar DNSSEC previo si existe registro DS cargado.

3. MENSAJE PARA SOPORTE ICXN (soporte@icxn.com.ar):
Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar: 1) el destino correcto para webmail y mail, 2) el registro DKIM (selector y valor TXT), y 3) si hay algún otro registro necesario para el correo del dominio. Gracias.`,
    content: `
# Migración DNS a Cloudflare & Vercel — koalalotiene.com.ar
**Planilla Técnica de Registros, Continuidad del Correo ICXN y Delegación en NIC Argentina**
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*
*Fecha: Septiembre 2026 · Dominio Oficial: koalalotiene.com.ar*

---

### Diagnóstico de la Zona y Hallazgos Clave

Al analizar el export de zona DNS y los registros actuales del dominio \`koalalotiene.com.ar\`, se desprenden cuatro conclusiones operativas fundamentales:

1. **Exportación de la Zona Nueva**:
   El export generado pertenece a la zona nueva de Cloudflare, la cual tiene asignados los nameservers **\`braelyn.ns.cloudflare.com\`** y **\`bryce.ns.cloudflare.com\`**. Los nameservers anteriores (\`nelly.ns\` y \`zac.ns\`) pertenecían a una zona previa de Cloudflare cuyos registros reales de origen estaban ocultos detrás del proxy naranja.

2. **El Correo Electrónico es Gestionado por ICXN**:
   * El registro CNAME \`mail\` apunta al host dinámico **\`icxn-lp.dvrdns.org\`**.
   * El registro SPF autoriza los envíos mediante **\`outbound.mailhop.org\`**.
   * El registro DMARC envía los reportes de seguridad a **\`soporte@icxn.com.ar\`**.

3. **Riesgo Crítico de Caída de Correo Evitado**:
   El registro \`mail\` figuraba con el proxy naranja encendido (\`cf-proxied: true\`). En Cloudflare, **un registro MX jamás debe apuntar a un host proxied**, porque Cloudflare descarta el tráfico SMTP entrante. El registro \`mail\` debe estar estrictamente en modo **DNS only (nube gris)** antes de delegar los servidores en NIC.ar.

4. **Destino Web en Vercel**:
   La tienda web oficial se sirve a través de la infraestructura global de Vercel. El dominio raíz (\`@\`) y el subdominio (\`www\`) deben configurarse como **CNAME apuntando a \`16bc395e55b20519.vercel-dns-017.com\`** en modo **DNS only**. Cloudflare aplica *CNAME Flattening* automático en la raíz sin romper compatibilidad.

---

### Tabla Definitiva de Registros DNS para Cloudflare

| Acción | Tipo | Nombre | Contenido / Destino | Proxy Cloudflare | Prioridad / TTL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Borrar** | A y AAAA | \`@\` (raíz) | IPs proxies de Cloudflare (zona anterior) | Eliminar registro | - |
| **Borrar** | A y AAAA | \`www\` | IPs proxies de Cloudflare (zona anterior) | Eliminar registro | - |
| **Agregar** | CNAME | \`@\` | \`16bc395e55b20519.vercel-dns-017.com\` | **DNS only (Gris)** | Auto |
| **Agregar** | CNAME | \`www\` | \`16bc395e55b20519.vercel-dns-017.com\` | **DNS only (Gris)** | Auto |
| **Editar** | CNAME | \`mail\` | \`icxn-lp.dvrdns.org\` | **DNS only (Gris)** | Auto |
| **Reemplazar** | CNAME | \`webmail\` | \`icxn-lp.dvrdns.org\` *(a confirmar con ICXN)* | **DNS only (Gris)** | Auto |
| **Dejar** | MX | \`@\` | \`10 mail.koalalotiene.com.ar\` | **DNS only** | 10 |
| **Dejar** | TXT | \`@\` | \`v=spf1 include:outbound.mailhop.org ?all\` | **DNS only** | Auto |
| **Dejar** | TXT | \`_dmarc\` | \`v=DMARC1; p=none; rua=mailto:soporte@icxn.com.ar\` | **DNS only** | Auto |
| **Pedir** | TXT | Selector DKIM | \`v=DKIM1; k=rsa; p=...\` *(proporcionado por ICXN)* | **DNS only** | Auto |

---

### Cronograma de Migración y Orden de Pasos

1. **Cargar la Tabla en Cloudflare**:
   Acceder a la zona de \`koalalotiene.com.ar\` en la nueva cuenta de Cloudflare. Eliminar los registros A/AAAA obsoletos de la raíz y www, cargar los CNAME de Vercel y pasar \`mail\` a nube gris (DNS only).

2. **Enviar Consulta a ICXN**:
   Remitir el mensaje modelo a \`soporte@icxn.com.ar\` solicitando la confirmación de la URL de webmail y el registro DKIM. Si se desea habilitar la web de inmediato, se puede avanzar con los nameservers manteniendo el MX y CNAME mail intactos, completando webmail y DKIM a posteriori.

3. **Desactivar DNSSEC en NIC Argentina (nic.ar)**:
   Antes de modificar los servidores de nombre, verificar si en el panel de NIC.ar existe un registro DS (DNSSEC). Si figura cargado, **eliminarlo** para evitar que los proveedores de internet bloqueen la resolución del dominio durante la propagación.

4. **Delegar Servidores en NIC Argentina**:
   Reemplazar \`nelly.ns.cloudflare.com\` y \`zac.ns.cloudflare.com\` por:
   * **\`braelyn.ns.cloudflare.com\`**
   * **\`bryce.ns.cloudflare.com\`**
   Guardar cambios.

5. **Verificación y Salida a Producción en Vercel**:
   En Cloudflare, presionar el botón **"Check nameservers"**. Una vez que figure en estado **"Active"**, ingresar al panel de Vercel y pulsar **"Refresh"** para \`koalalotiene.com.ar\` y \`www.koalalotiene.com.ar\`. Vercel emitirá el certificado SSL Let's Encrypt de forma automática en pocos minutos.

6. **Prueba de Fuego de Correo**:
   Enviar un correo desde una cuenta externa (Gmail/Outlook) hacia una casilla institucional del dominio y verificar su recepción en Webmail o cliente de escritorio.
    `
  },
  {
    id: 'monitoreo-webhooks-icxn',
    category: 'tecnico',
    categoryLabel: '02. Integración ERP & Webhooks (ICXN)',
    title: 'Monitoreo de Webhooks ICXN y Sincronización Real-Time',
    subtitle: 'Auditoría de Eventos, Ticker de Eventos Exitosos/Reintentos y Verificación de Latencia Target < 1s',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Especificación técnica de la card ERP Sync Monitor y la pestaña Webhook Logs en AdminPanelModal. Monitoreo de latencia < 1s, trazabilidad de eventos stock.updated/order.confirmed, política de reintentos exponenciales y de-duplicación de payloads JSON.',
    copyableText: `Monitoreo de Webhooks ICXN y Sincronización Real-Time:

1. TABLERO ERP SYNC MONITOR:
• Muestra live ticker de eventos webhooks procesados exitosamente (200 OK) vs. reintentos (5xx / Timeout).
• Monitorea la latencia target (< 1s / ~180ms) para garantizar la reserva atómica de stock en checkout online.
• Muestra el estado del gateway ICXN: Operativo, Latencia Alta o Desconectado.

2. PESTAÑA WEBHOOK LOGS EN ADMIN PANEL:
• Renderiza la lista webhookEvents en una tabla searchable con filtros por estado (Success, Error, Warning, Pending).
• Permite inspeccionar el payload JSON completo con un toggle desplegable para debugging de consistencia entre mostrador y web.
• Permite filtrar por SKU o ID de Orden para auditar movimientos históricos de inventario.

3. REINTENTOS Y TOLERANCIA A FALLOS:
• Backoff exponencial: 0s, 5s, 30s, 5m ante errores temporales del servidor.
• Log permanente en el navegador y servidor para diagnóstico rápido del equipo de soporte de Clientum.`,
    content: `
# Monitoreo de Webhooks ICXN y Sincronización en Tiempo Real

**Especificación Técnica del Tablero de Monitoreo de Eventos ERP & Audit Trail**
*Cliente: Koala Cotillón / LP SRL*
*Sistema de Gestión de Origen: Gateway ICXN ERP*
*Meta de Latencia Target: < 1 segundo (Reserva "0 Segundos")*

---

## 1. Visión General del Tablero de Monitoreo ICXN

Para garantizar la promesa de reserva de stock atómica e instantánea (evitando sobreventas cruzadas entre mostrador físico y tienda online), la plataforma incorpora en el **Panel de Administración (\`AdminPanelModal\`)** un centro de control de eventos HTTP Webhooks en tiempo real emitidos por el gateway de **ICXN ERP**.

---

## 2. Componentes UI Implementados

### 2.1 Card \`ERP Sync Monitor\` (Dashboard Principal)
Ubicada en la vista general del panel administrativo, proporciona métricas operativas inmediatas:
1. **Live Ticker de Eventos**:
   - **Exitosos (HTTP 200 OK)**: Contador en verde de webhooks procesados correctamente.
   - **Reintentos / Error (HTTP 5xx / Timeout)**: Contador de eventos fallidos o en retry.
2. **Indicador de Meta '0 Segundos'**:
   - Muestra la latencia promedio de respuesta del endpoint \`/api/erp/webhooks/icxn\` (ej. \`180 ms\`).
3. **Estado de Conexión del Gateway**:
   - \`Operativo\`: Recepción continua de eventos en los últimos 5 minutos.

### 2.2 Tab \`Webhook Logs\` (\`AdminPanelModal\`)
Renderiza el arreglo \`webhookEvents\` con las siguientes columnas:
- **Timestamp**: Fecha y hora con milisegundos.
- **Event Type**: \`stock.updated\`, \`price.changed\`, \`order.confirmed\`, \`reservation.failed\`.
- **Status**: \`SUCCESS\` (Verde), \`WARNING\` (Amarillo), \`ERROR\` (Rojo), \`PENDING\` (Azul).
- **Source**: Origen del evento.
- **Payload Toggle**: Botón desplegable para inspeccionar el cuerpo JSON completo.
`
  },
  {
    id: 'mensaje-milton-respuestas-mikhail',
    category: 'comercial',
    categoryLabel: '01. Comunicación & WhatsApp Milton',
    title: 'Mensaje para Milton (para reenviar a Mikhail)',
    subtitle: 'Resumen de Stock, Plazos (10 Días Hábiles) y Requerimientos con Advertencia de Sincronización',
    lastUpdated: 'Septiembre 2026',
    readTime: '3 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Mensaje listo para reenviar a Mikhail Murekian sobre stock, tiempos de entrega y requerimientos iniciales, junto a la advertencia técnica sobre la frecuencia de sincronización con ICXN.',
    copyableText: `Milton, ¿cómo andás? Te paso el resumen alineado para reenviar a Mikhail sobre la tienda web de Koala:

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

Cualquier duda quedo a disposición.`,
    content: `
# Mensaje para Milton (para reenviar a Mikhail)
**Resumen Comercial y Operativo para la Dirección de Koala (LP SRL)**  
*Destinatario Intermedio: Milton · Destinatario Final: Mikhail Murekian*

---

### 1. Mensaje Modelo para Copiar y Enviar
\`\`\`text
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
\`\`\`

---

### 2. Pautas Clave de Comunicación
* **Dirección Provisoria**: Usar "dirección provisoria" (en lugar de interna), ya que es un entorno público para revisiones.
* **Propagación DNS**: Usar "en un horario tranquilo" (evitando "de madrugada" o "corte programado").
* **Sincronización Transparente**: Explicación honesta de la reserva atómica en checkout web vs la frecuencia de actualización del mostrador físico.
* **Credenciales MCP**: Solicitud explícita de usuario Read-Only sobre el ERP.
    `
  },
  {
    id: 'revision-analisis-consistencia-koala',
    category: 'comercial',
    categoryLabel: '01. Auditoría Comercial & Estrategia',
    title: 'Auditoría y Análisis de Consistencia Integral (Koala)',
    subtitle: 'Resolución de los 6 Problemas Principales, 4 Ajustes de Comunicación y Cuadro de Pendientes',
    lastUpdated: 'Septiembre 2026',
    readTime: '6 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Auditoría detallada de la propuesta comercial, respuestas a Mikhail, mensaje a Milton y estado real del dominio koalalotiene.com.ar. Resolución de plazos (10 días), stock, Evolution API vs Cloud API, servidor MCP y delegación DNS.',
    copyableText: `Auditoría y Análisis de Consistencia Integral (Resumen):

1. SEIS PROBLEMAS CLAVE RESUELTOS:
• Plazos: Estandarización en 10 días hábiles (vista previa en dirección provisoria en 2 a 5 días).
• Stock: Reserva atómica instantánea en checkout web; aclaración honesta de frecuencia de actualización con el mostrador físico.
• WhatsApp: Mitigación de Evolution API mediante arquitectura desacoplada y propuesta de WhatsApp Cloud API oficial.
• Servidor MCP: Requerimiento explícito de usuario Read-Only al ERP para consultas de IA sin alucinaciones.
• Alcance: Delimitación clara entre la Etapa 1 (Tienda Web) e ítems complementarios (Google Ads, Club Koala, fotos).
• Dominio: Corrección del estado del dominio koalalotiene.com.ar (delegación pendiente en NIC.ar a braelyn/bryce).

2. CUATRO AJUSTES EN COMUNICACIÓN:
• "Dirección provisoria" en lugar de "interna".
• "Horario tranquilo" para la propagación DNS en NIC.ar.
• Explicación técnica honesta de la sincronización de stock sin excusas.
• Tono directo y seguro ante consultas sobre ventas en paralelo.`,
    content: `
# Auditoría y Análisis de Consistencia Integral — Koala Lo Tiene (LP SRL)

**Análisis de Alineación Comercial, Técnica y Operativa para la Dirección**

---

## 1. Los Seis Problemas Principales Identificados y su Resolución

### 1.1 Plazos de Puesta en Marcha (Estandarización en 10 Días Hábiles)
Estandarización del cronograma oficial en **10 días hábiles** (Etapa 1: Días 1-3, Etapa 2: Días 4-8, Etapa 3: Días 9-10), aclarando que la dirección provisoria permite revisiones desde el día 2 a 5.

### 1.2 Sincronización de Stock y Reserva Atómica
El stock se reserva al instante en el checkout web. La actualización con las cajas físicas del mostrador depende de la frecuencia del ERP, comunicado con transparencia.

### 1.3 Evolución API vs. WhatsApp Cloud API Oficial
Arquitectura modular sobre backend propio: inicio ágil con el canal actual y migración a Cloud API oficial para alto volumen.

### 1.4 Servidor MCP y Acceso a Base de Datos ERP
Requerimiento formal de credenciales Read-Only sobre la base de datos del ERP para el servidor MCP.

### 1.5 Alcance Prometido vs. Servicios Adicionales
Clarificación del alcance de la Etapa 1 (E-commerce) marcando pauta publicitaria y fidelización para etapas posteriores.

### 1.6 Estado del Dominio koalalotiene.com.ar
Actualización de la propuesta especificando la delegación pendiente en NIC Argentina a \`braelyn\` y \`bryce\` en Cloudflare.

---

## 2. Ajustes en la Comunicación con Milton
1. **Dirección Provisoria**: Cambio de terminología.
2. **Propagación en Horario Tranquilo**: Explicación transparente de propagación DNS.
3. **Explicación Honesta de Stock**: Sin justificaciones inventadas.
4. **Tono Directo**: Respuestas claras a Mikhail.
`
  },
  {
    id: 'minuta-chat-rafael-gonzalez-icxn-api',
    category: 'tecnico',
    categoryLabel: '02. Integración ERP & ICXN API',
    title: 'Confirmación de API ERP ICXN — Chat con Rafael González',
    subtitle: 'Transcripción Oficial, Confirmación de Desarrollo a Medida y Estrategia de Entrega OpenAPI',
    lastUpdated: '30 de Septiembre 2026',
    readTime: '3 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Registro del intercambio con Rafael González (ICXN). Confirmación de uso de ERP por parte de Koala y disponibilidad de API custom. Estrategia de entrega de especificación OpenAPI ya desarrollada por Clientum.',
    copyableText: `Confirmación de API ERP ICXN (Rafael González - 30/09/2026):

1. CONFIRMACIÓN DE ERP ICXN:
• Rafael González confirma que Koala (LP SRL) utiliza activamente el ERP de ICXN.
• ICXN desarrolla integraciones por API a medida para sus clientes.

2. ESTRATEGIA CLIENTUM:
• Dado que ICXN prepara la documentación cuando se arma el proyecto, Clientum le entrega de forma proactiva el Manual de Integración OpenAPI (01_manual_integracion_erp.md).
• Se solicitan credenciales Read-Only para el servidor MCP y recepción de webhooks de stock en /api/erp/webhooks/icxn.`,
    content: `
# Confirmación de API ERP ICXN — Chat con Rafael González

**Registro de Intercambio Técnico & Plan de Acción para Integración ERP**
*Interlocutores: Jonathan (Clientum) y Rafael González (ERP ICXN)*
*Fecha: 30 de Septiembre de 2026*

---

## 1. Transcripción Oficial del Intercambio
\`\`\`text
[18:08, 30/9/2026] Rafael González: Koala esta usando su erp? si
[18:08, 30/9/2026] Rafael González: Tienen integración por api? si, a pedido de cada cliente
[18:25, 30/9/2026] Rafael González: tenes alguna documentacion en pdf o algo similar?
no, se prepara como documentación cuando se arma el proyecto, con los endpoints a publicar o consumir y demás cuestiones. consulto si han indicado algo de LP o Koala y te aviso, seguramente mañana
\`\`\`

---

## 2. Diagnóstico y Plan de Acción
1. **ICXN confirma uso de ERP y API custom**: La integración por API existe y se activa por proyecto.
2. **Acción Proactiva**: Clientum envía la especificación OpenAPI lista para usar (\`01_manual_integracion_erp.md\`), acelerando la publicación de endpoints.
`
  },
  {
    id: 'proceso-paso-a-paso-hoja-de-ruta-golive',
    category: 'comercial',
    categoryLabel: '01. Master Roadmap & Go-Live',
    title: 'Master Roadmap Paso a Paso — Puesta en Marcha (10 Días)',
    subtitle: 'Checklist de Fases (Fase 0 a Fase 3), Matriz de Responsabilidades y Ejecución',
    lastUpdated: 'Septiembre 2026',
    readTime: '5 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Guía paso a paso del proceso completo de implementación: Fase 0 (Cierre y OpenAPI), Fase 1 (Configuración base, DNS y catálogo), Fase 2 (Integración ERP ICXN y logística) y Fase 3 (QA, SSL y lanzamiento público).',
    copyableText: `Master Roadmap Paso a Paso (10 Días Hábiles):

FASE 0: CIERRE Y ALINEACIÓN (Día 0)
• Milton reenvía mensaje alineado a Mikhail Murekian.
• Jonathan envía especificación OpenAPI a Rafael González (ICXN).

FASE 1: CONFIGURACIÓN BASE, DOMINIO Y CATÁLOGO (Días 1-3)
• Configurar CNAME Vercel en Cloudflare en DNS-only.
• Reemplazar nameservers en NIC Argentina por braelyn y bryce.
• Cargar catálogo inicial y Mercado Pago Access Token.

FASE 2: INTEGRACIÓN ERP Y LOGÍSTICA (Días 4-8)
• Conectar webhooks ICXN (/api/erp/webhooks/icxn) o activar Cron CSV.
• Parametrizar fletes por CP y radios en km.
• Probar automatizaciones de WhatsApp.

FASE 3: QA, SSL Y LANZAMIENTO (Días 9-10)
• Validar SSL en Vercel tras propagación DNS.
• Prueba de fuego de correo SMTP.
• Ejecución de compra de prueba y lanzamiento oficial.`,
    content: `
# Master Roadmap Paso a Paso — Proceso Completo de Puesta en Marcha

**Guía Operativa de Ejecución para Clientum, Milton, Koala (LP SRL) e ICXN**

---

## 1. El Proceso Completo Paso a Paso

### FASE 0: Cierre Comercial & Alineación Técnica (Hoy / Día 0)
* **Paso 0.1 — Reenvío del Mensaje Alineado a Milton**: Reenvío del mensaje formal a Mikhail (LP SRL).
* **Paso 0.2 — Entrega de Especificación OpenAPI a ICXN (Rafael González)**: Entrega de la especificación técnica.

### FASE 1: Configuración Base, Dominio y Carga Inicial (Días 1 a 3)
* **Paso 1.1 — Limpieza y Configuración DNS en Cloudflare**: CNAME de Vercel y registros MX/mail en DNS only.
* **Paso 1.2 — Delegación en NIC Argentina (nic.ar)**: Cambio de servidores a \`braelyn\` y \`bryce\`.
* **Paso 1.3 — Carga de Catálogo Inicial & Credenciales**: Carga masiva de catálogo y Mercado Pago.

### FASE 2: Integración ERP & Logística Territorial (Días 4 a 8)
* **Paso 2.1 — Conexión con ICXN ERP**: Webhooks en tiempo real o archivo CSV fallback.
* **Paso 2.2 — Parametrización Logística**: Fletes por Código Postal y envío gratis.
* **Paso 2.3 — Automatización por WhatsApp**: Bot y derivación de cotizaciones.

### FASE 3: QA, Certificación SSL y Lanzamiento Público (Días 9 a 10)
* **Paso 3.1 — Validación de SSL Let's Encrypt**: Certificación segura HTTPS en Vercel.
* **Paso 3.2 — Prueba de Fuego de Correo SMTP**: Recepción en casillas del dominio.
* **Paso 3.3 — Pruebas Integrales de Compra**: Compra de prueba y reserva atómica de stock.
* **Paso 3.4 — Lanzamiento Oficial**: Salida a producción pública.
`
  },
  {
    id: 'checklist-hoja-calculo-dns',
    category: 'tecnico',
    categoryLabel: '02. Infraestructura & Excel DNS',
    title: 'Checklist de Migración DNS & Hoja de Cálculo (koala-dns-checklist.xlsx)',
    subtitle: 'Seguimiento de 9 Pasos, 21 Registros, Consulta a ICXN y Plantillas',
    lastUpdated: 'Septiembre 2026',
    readTime: '4 min',
    requiresClientumSupport: true,
    restrictedToRole: ['backend'],
    summary: 'Documentación técnica de la hoja de cálculo koala-dns-checklist.xlsx: 17 tareas de Cloudflare, tabla de consulta a ICXN, 9 pasos operativos y nombres de servidores en NIC Argentina.',
    copyableText: `Checklist Rápido de Migración DNS (koalalotiene.com.ar):
1. Cargar y corregir los registros en Cloudflare (mail y webmail en DNS only).
2. Consultar a soporte@icxn.com.ar destino de webmail y clave DKIM.
3. Completar webmail y DKIM con la respuesta de ICXN.
4. Presionar "Continue to activation" en Cloudflare.
5. Eliminar registro DS (DNSSEC) en NIC Argentina si existe.
6. Reemplazar nameservers: quitar nelly/zac y poner braelyn.ns.cloudflare.com y bryce.ns.cloudflare.com.
7. Verificar activación en Cloudflare ("Check nameservers").
8. Refrescar dominios en Vercel ("Refresh" en @ y www).
9. Probar correo y webmail desde y hacia casilla del dominio.`,
    content: `
# Checklist de Migración DNS & Hoja de Cálculo
**Control Operativo del Libro \`koala-dns-checklist.xlsx\`**

---

### 1. Las 3 Pestañas del Archivo Excel
1. **Registros DNS**: Los 21 registros del dominio (17 cambios pendientes en Cloudflare + 4 que se dejan intactos), con cálculo automático de progreso porcentual.
2. **Pasos**: 9 pasos cronológicos recomendados con responsables y validación, más tabla de nameservers a quitar (\`nelly\` y \`zac\`) y a poner (\`braelyn\` y \`bryce\`).
3. **Consulta ICXN**: 4 puntos a consultar a \`soporte@icxn.com.ar\` (destino webmail, destino mail, selector DKIM y otros registros).

---

### 2. Mensaje Oficial para ICXN
\`\`\`text
Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar:
1) El destino correcto para webmail y mail (¿ambos apuntan a icxn-lp.dvrdns.org?).
2) El registro DKIM (selector y valor TXT completo para la firma del dominio).
3) Si hay algún otro registro necesario para el correo del dominio que deba conservarse.

Los registros MX (10 mail.koalalotiene.com.ar) y SPF (v=spf1 include:outbound.mailhop.org -all) ya se encuentran configurados en modo DNS only. Gracias.
\`\`\`
    `
  },
  {
    id: 'guia-demo-meet',
    category: 'demo',
    categoryLabel: '03. Guión Demo & Ventas',
    title: 'Guión de Demostración en Vivo para Google Meet',
    subtitle: 'Estructura cronometrada paso a paso (15–20 min) para cerrar la venta',
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
