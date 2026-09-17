# Índice Maestro de Documentación — Koala Lo Tiene × Clientum

Este repositorio contiene toda la documentación técnica, comercial y operativa para el proyecto de transformación digital de **Koala Lo Tiene (LP SRL)** y **Koala Ferretería y Corralón**.

---

## Estructura General de Carpetas

```
/docs/
├── README.md                                         # Este índice maestro
│
├── 01-comercial/                                     # Propuestas, cartas de oferta y estrategia
│   ├── 01_propuesta_unificada_koala.md               # Propuesta integral: Cotillón (LP SRL) + Ferretería
│   ├── 02_email_propuesta_mikhail.md                 # Plantilla de email comercial para Mikhail Murekian
│   ├── 03_puntos_de_dolor_redes_ecommerce_erp.md     # Flujo priorizado: Redes → E-Commerce → ERP
│   ├── 04_resumen_ejecutivo.md                       # Resumen ejecutivo de etapas y objetivos
│   └── propuesta-cotillon.html                       # Propuesta visual con diseño Clientum (imprimible/PDF)
│
├── 02-tecnico-y-erp/                                 # Arquitectura, endpoints y respuestas técnicas
│   ├── 01_manual_integracion_erp.md                  # Especificación técnica endpoints REST, CSV y Webhooks
│   └── 02_respuestas_tecnicas_mikhail.md             # Argumentación técnica: reserva atómica, Evolution API y MCP
│
└── 03-presentacion-demo/                             # Material para reuniones y validación en vivo
    ├── 01_guia_demo_meet.md                          # Guión cronometrado paso a paso para Google Meet
    └── 02_checklist_y_framing_demo.md                # Checklist pre-demo y pautas de framing
```

---

## 1. Módulo Comercial (`/docs/01-comercial/`)
* [01. Propuesta Unificada KOALA](./01-comercial/01_propuesta_unificada_koala.md): Documento completo con desglose de inversión, alcance de las 3 etapas y división entre Koala Cotillón (General Roca y Neuquén) y Koala Ferretería y Corralón (4 sucursales Neuquén).
* [02. Email para Mikhail Murekian](./01-comercial/02_email_propuesta_mikhail.md): Texto listo para enviar por correo formalizando la propuesta tras la llamada.
* [03. Puntos de Dolor: Redes → E-Commerce → ERP](./01-comercial/03_puntos_de_dolor_redes_ecommerce_erp.md): Explicación exhaustiva de cómo resolver la fuga de clientes en Instagram/Facebook, la falta de catálogo ágil y el riesgo de sobreventa.
* [04. Resumen Ejecutivo](./01-comercial/04_resumen_ejecutivo.md): Síntesis de pilares estratégicos y tiempos de entrega (Etapa 1 en ~15–17 días).
* [Propuesta Visual HTML / PDF](./01-comercial/propuesta-cotillon.html): Archivo web corporativo con estilos tipográficos Plus Jakarta Sans, colores institucionales y tablas de inversión para exportar a PDF o presentar en pantalla.

---

## 2. Módulo Técnico y ERP (`/docs/02-tecnico-y-erp/`)
* [01. Manual de Integración ERP](./02-tecnico-y-erp/01_manual_integracion_erp.md): Manual técnico con especificación de endpoints REST (`/api/erp/inventory-sync`, `/api/erp/stock/reserve`), formato de payloads JSON, importadores de CSV y mapeo de depósitos (General Roca `DEP-01` y Neuquén Capital `DEP-02`).
* [02. Respuestas Técnicas para Mikhail](./02-tecnico-y-erp/02_respuestas_tecnicas_mikhail.md): Justificación técnica sobre la reserva atómica en tiempo real en checkout, mitigación de riesgos con Evolution API vs. WhatsApp Cloud API oficial, y definición concreta del servidor MCP de IA.

---

## 3. Módulo de Presentación y Demo (`/docs/03-presentacion-demo/`)
* [01. Guía de Demostración en Google Meet](./03-presentacion-demo/01_guia_demo_meet.md): Estructura de llamada de 15 a 20 minutos con discurso de apertura, navegación guiada y respuestas a objeciones comunes.
* [02. Checklist Técnico y Framing de la Demo](./03-presentacion-demo/02_checklist_y_framing_demo.md): Reglas de oro sobre cómo presentar el prototipo sin sobrevender integraciones en desarrollo y lista de chequeo de datos reales.
