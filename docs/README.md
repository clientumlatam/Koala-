# Índice Maestro de Documentación — Koala Lo Tiene × Clientum

Este repositorio contiene toda la documentación técnica, comercial y operativa para el proyecto de transformación digital de **Koala Lo Tiene (LP SRL)** y **Koala Ferretería y Corralón**.

---

## Estructura General de Carpetas

```
/docs/
├── README.md                                                 # Este índice maestro
│
├── 01-comercial/                                             # Propuestas, cartas de oferta y estrategia
│   ├── 01_propuesta_unificada_koala.md                       # Propuesta integral: Cotillón (LP SRL) + Ferretería
│   ├── 02_email_propuesta_mikhail.md                         # Plantilla de email comercial para Mikhail Murekian
│   ├── 03_puntos_de_dolor_redes_ecommerce_erp.md             # Flujo priorizado: Redes → E-Commerce → ERP
│   ├── 04_resumen_ejecutivo.md                               # Resumen ejecutivo de etapas y objetivos
│   ├── 05_plan_implementacion_y_tiempos_koalas.md            # Plan de puesta en marcha en 10 días hábiles y flujo operativo
│   ├── 06_mensaje_milton_respuestas_mikhail.md               # Mensaje para Milton (para reenviar a Mikhail) con notas de stock
│   ├── 07_revision_analisis_consistencia_koala.md            # Auditoría de inconsistencias de negocio, 4 ajustes y pendientes
│   ├── 08_proceso_paso_a_paso_hoja_de_ruta_golive.md         # Master Roadmap paso a paso, matriz de responsabilidades y fases
│   └── propuesta-cotillon.html                               # Propuesta visual con diseño Clientum (imprimible/PDF)
│
├── 02-tecnico-y-erp/                                         # Arquitectura, DNS, endpoints y respuestas técnicas
│   ├── 01_manual_integracion_erp.md                          # Especificación técnica endpoints REST, CSV y Webhooks
│   ├── 02_respuestas_tecnicas_mikhail.md                     # Argumentación técnica: reserva atómica, Evolution API y MCP
│   ├── 03_migracion_dns_cloudflare_vercel_icxn.md            # Planilla técnica de registros DNS, correo ICXN y delegación nic.ar
│   ├── 04_checklist_y_hoja_calculo_dns.md                    # Checklist de los 9 pasos y estructura del Excel (koala-dns-checklist.xlsx)
│   ├── 05_respuestas_consultas_milton_tienda_web.md          # 6 respuestas técnicas detalladas a consultas de Milton
│   ├── 06_monitoreo_webhooks_icxn_y_sincronizacion.md        # Monitoreo de webhooks ICXN, logs de eventos y verificación target 0s
│   └── 07_minuta_chat_rafael_gonzalez_icxn_api.md            # Confirmación de ERP ICXN, estrategia de API y mensaje para Rafael
│
└── 03-presentacion-demo/                                     # Material para reuniones y validación en vivo
    ├── 01_guia_demo_meet.md                                  # Guión cronometrado paso a paso para Google Meet
    └── 02_checklist_y_framing_demo.md                        # Checklist pre-demo y pautas de framing
```

---

## 1. Módulo Comercial (`/docs/01-comercial/`)
* [01. Propuesta Unificada KOALA](./01-comercial/01_propuesta_unificada_koala.md): Documento completo con desglose de inversión, alcance de las 3 etapas, cronograma de 10 días hábiles y división entre Koala Cotillón y Ferretería.
* [02. Email para Mikhail Murekian](./01-comercial/02_email_propuesta_mikhail.md): Texto listo para enviar por correo formalizando la propuesta tras la llamada.
* [03. Puntos de Dolor: Redes → E-Commerce → ERP](./01-comercial/03_puntos_de_dolor_redes_ecommerce_erp.md): Explicación exhaustiva de cómo resolver la fuga de clientes en Instagram/Facebook, la falta de catálogo ágil y el riesgo de sobreventa.
* [04. Resumen Ejecutivo](./01-comercial/04_resumen_ejecutivo.md): Síntesis de pilares estratégicos y tiempos de entrega.
* [05. Plan de Implementación y Tiempos para Koalas](./01-comercial/05_plan_implementacion_y_tiempos_koalas.md): Cronograma de 10 días hábiles (Etapa 1: Días 1-3, Etapa 2: Días 4-8, Etapa 3: Días 9-10), flujo operativo en 6 pasos y requerimientos de inicio.
* [06. Mensaje para Milton (para reenviar a Mikhail)](./01-comercial/06_mensaje_milton_respuestas_mikhail.md): Mensaje resumido para WhatsApp/Email, requerimientos para iniciar y advertencia sobre sincronización de stock con ICXN.
* [07. Auditoría y Análisis de Consistencia](./01-comercial/07_revision_analisis_consistencia_koala.md): Auditoría completa de los 6 problemas clave de negocio, 4 ajustes en comunicación con Milton, WhatsApp Evolution vs Cloud API y pendientes.
* [08. Master Roadmap Paso a Paso](./01-comercial/08_proceso_paso_a_paso_hoja_de_ruta_golive.md): Hoja de ruta completa de 10 días hábiles (Fase 0 a Fase 3), checklist de tareas por responsable y matriz de ejecución.
* [Propuesta Visual HTML / PDF](./01-comercial/propuesta-cotillon.html): Archivo web corporativo con diseño Clientum para exportar a PDF o presentar en pantalla.

---

## 2. Módulo Técnico, DNS y ERP (`/docs/02-tecnico-y-erp/`)
* [01. Manual de Integración ERP](./02-tecnico-y-erp/01_manual_integracion_erp.md): Manual técnico con especificación de endpoints REST (`/api/erp/inventory-sync`, `/api/erp/stock/reserve`), formato de payloads JSON, importadores de CSV y mapeo de depósitos (General Roca `DEP-01` y Neuquén Capital `DEP-02`).
* [02. Respuestas Técnicas para Mikhail](./02-tecnico-y-erp/02_respuestas_tecnicas_mikhail.md): Respuestas sobre reserva atómica temporal en checkout, mitigación con Evolution API vs WhatsApp Cloud API oficial, definición del servidor MCP, sincronización de stock y estabilidad del correo.
* [03. Migración DNS a Cloudflare, Vercel e ICXN](./02-tecnico-y-erp/03_migracion_dns_cloudflare_vercel_icxn.md): Tabla de los 21 registros de la zona para `koalalotiene.com.ar`, modo DNS only obligatorio en `mail` para no romper el MX, redirección 308 de raíz a `www`, y delegación en NIC Argentina con desactivación de DNSSEC.
* [04. Checklist y Hoja de Cálculo DNS](./02-tecnico-y-erp/04_checklist_y_hoja_calculo_dns.md): Estructura del libro Excel (`koala-dns-checklist.xlsx` / `koalalotiene_dns_migracion_cloudflare.xlsx`), los 9 pasos cronológicos, consulta a `soporte@icxn.com.ar` y rollback a `nelly`/`zac`.
* [05. Respuestas a Consultas de Milton sobre la Tienda Web](./02-tecnico-y-erp/05_respuestas_consultas_milton_tienda_web.md): Respuestas a las 6 consultas: stock en 0 seg, impacto de ingreso de mercadería en depósito, cálculo de flete y envíos gratis, chatbot híbrido vs WhatsApp, captación en Google / SEO / Maps, y delimitación por radio en km y código postal.
* [06. Monitoreo de Webhooks ICXN y Sincronización](./02-tecnico-y-erp/06_monitoreo_webhooks_icxn_y_sincronizacion.md): Especificación técnica de la card `ERP Sync Monitor`, tab `Webhook Logs` en `AdminPanelModal`, auditoría de eventos `webhookEvents` y meta de latencia < 1s.
* [07. Confirmación de API ERP ICXN (Rafael González)](./02-tecnico-y-erp/07_minuta_chat_rafael_gonzalez_icxn_api.md): Transcripción del chat de WhatsApp, diagnóstico de desarrollo de API a medida e inclusión de la respuesta modelo para ICXN.

---

## 3. Módulo de Presentación y Demo (`/docs/03-presentacion-demo/`)
* [01. Guía de Demostración en Google Meet](./03-presentacion-demo/01_guia_demo_meet.md): Estructura de llamada de 15 a 20 minutos con discurso de apertura, navegación guiada y respuestas a objeciones comunes.
* [02. Checklist Técnico y Framing de la Demo](./03-presentacion-demo/02_checklist_y_framing_demo.md): Reglas de oro sobre cómo presentar el prototipo sin sobrevender integraciones en desarrollo y lista de chequeo de datos reales.
