# Master Roadmap Paso a Paso — Proceso Completo de Puesta en Marcha

**Guía Operativa de Ejecución para Clientum, Milton, Koala (LP SRL) e ICXN**  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno*  
*Dominio Oficial: koalalotiene.com.ar | Plataforma: Clientum E-Commerce & ERP Gateway*  
*Fecha: Septiembre 2026*

---

## 1. Estado Actual: ¿Qué está Listo y Qué Falta?

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ESTADO GLOBAL DEL PROYECTO                      │
├────────────────────────────────┬───────────────────────────────────────┤
│ COMPONENTE                     │ ESTADO ACTUAL                         │
├────────────────────────────────┼───────────────────────────────────────┤
│ 1. Plataforma Web & Backend    │ 🟢 100% Desarrollada (Vercel / React) │
│ 2. Tablero ERP Sync & Webhooks │ 🟢 100% Implementado (Admin Panel)    │
│ 3. Documentación & Excel DNS   │ 🟢 100% Generados (.xlsx y .md)       │
│ 4. Respuesta Técnica ICXN      │ 🟡 En curso (Chat con Rafael ok)      │
│ 5. Delegación DNS en nic.ar    │ 🔴 Pendiente (Ejecución en nic.ar)    │
│ 6. Catálogo & Accesos Cliente  │ 🔴 Pendiente (Entrega por Koala)      │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. El Proceso Completo Paso a Paso (Hoja de Ruta de 10 Días)

### FASE 0: Cierre Comercial & Alineación Técnica (Hoy / Día 0)

* [ ] **Paso 0.1 — Reenvío del Mensaje Alineado a Milton**:
  * Milton reenvía a Mikhail Murekian (LP SRL) el mensaje con la aclaración de plazos (10 días hábiles), la explicación honesta de reserva atómica de stock en checkout web y la lista de requerimientos iniciales.
* [ ] **Paso 0.2 — Entrega de Especificación OpenAPI a ICXN (Rafael González)**:
  * Jonathan (Clientum) responde a Rafael González adjuntándole la especificación de endpoints (`01_manual_integracion_erp.md`) para que ICXN habilite la conexión custom o nos provea un usuario Read-Only.

---

### FASE 1: Configuración Base, Dominio y Carga Inicial (Días 1 a 3)

* [ ] **Paso 1.1 — Limpieza y Configuración de Registros DNS en Cloudflare**:
  1. Ingresar al panel de Cloudflare de `koalalotiene.com.ar`.
  2. Eliminar los 2 registros A y 2 AAAA obsoletos de `@` y `www`.
  3. Crear CNAME `@` y `www` apuntando a `16bc395e55b20519.vercel-dns-017.com` en modo **DNS only (nube gris)**.
  4. Asegurar que `mail` y `webmail` apunten a `icxn-lp.dvrdns.org` en modo **DNS only (nube gris)**.
  5. Verificar que el MX permanezca apuntando a `10 mail.koalalotiene.com.ar`.
* [ ] **Paso 1.2 — Delegación en NIC Argentina (nic.ar)**:
  1. Ingresar a `nic.ar` con la cuenta titular del dominio.
  2. Desactivar cualquier registro DS / DNSSEC que pudiera estar activo.
  3. Reemplazar los servidores de nombre antiguos por `braelyn.ns.cloudflare.com` y `bryce.ns.cloudflare.com`.
  4. *Nota*: Esta acción se realiza en un horario tranquilo y no interrumpe el servicio de correo actual.
* [ ] **Paso 1.3 — Carga de Catálogo Inicial & Credenciales**:
  1. Recepción del listado de productos con precios, stock por depósito (`DEP-01` Roca y `DEP-02` Neuquén) y fotografías.
  2. Carga masiva mediante el importador CSV en la plataforma.
  3. Configuración de credenciales de cobro (Mercado Pago Access Tokens) y número de WhatsApp oficial.

---

### FASE 2: Integración ERP & Logística Territorial (Días 4 a 8)

* [ ] **Paso 2.1 — Conexión con ICXN ERP (o Canal CSV Fallback)**:
  * **Opción A (API Real-Time)**: Configuración del endpoint de webhooks `/api/erp/webhooks/icxn` en la API enviada por Rafael para recibir actualizaciones instantáneas de mostrador.
  * **Opción B (CSV / FTP Cron)**: Si ICXN requiere más tiempo, se deja activo el Cron Job de actualización por archivo CSV cada 15-30 minutos.
* [ ] **Paso 2.2 — Parametrización Logística y Envíos**:
  1. Configuración de la dirección de fábrica (Av. Roca 1350) y salón Neuquén (Mitre 678).
  2. Definición de radios de entrega local por Código Postal y reglas de envío gratis por monto.
* [ ] **Paso 2.3 — Automatización de Atenciones por WhatsApp**:
  1. Configuración de la derivación inteligente de carritos y cotizaciones directamente al WhatsApp del equipo de ventas.
  2. Verificación de respuestas automáticas sin alucinaciones mediante el Servidor MCP.

---

### FASE 3: QA, Certificación SSL y Lanzamiento Público (Días 9 a 10)

* [ ] **Paso 3.1 — Validación de Propagación DNS & Emisión SSL Let's Encrypt**:
  1. Verificar estado **Active** en el panel de Cloudflare.
  2. Pulsar **Refresh** en el panel de Vercel para `koalalotiene.com.ar` y `www.koalalotiene.com.ar`.
  3. Comprobar que Vercel valide la configuración y emita el certificado SSL seguro (HTTPS).
* [ ] **Paso 3.2 — Prueba de Fuego de Correo SMTP & Recepción**:
  1. Enviar correo de prueba hacia una casilla del dominio (ej. `info@koalalotiene.com.ar`).
  2. Confirmar recepción en Webmail / cliente de correo de ICXN.
* [ ] **Paso 3.3 — Pruebas Integrales de Compra (End-to-End)**:
  1. Realizar compra de prueba con Mercado Pago Sandbox.
  2. Verificar reserva atómica de stock en checkout.
  3. Verificar entrada de log en la pestaña `Webhook Logs` del panel de administración.
* [ ] **Paso 3.4 — Lanzamiento Oficial & Entrega a Koala**:
  * Anuncio público de la nueva tienda online de Koala Cotillón.

---

## 3. Matriz de Responsabilidades

| Tarea | Responsable Principal | Soporte |
| :--- | :--- | :--- |
| Enviar mensaje con requerimientos a Mikhail | **Milton** | Clientum |
| Habilitación de API / Credenciales Read-Only | **Rafael González (ICXN)** | Clientum |
| Delegación de Nameservers en nic.ar | **Titular Koala (LP SRL)** | Clientum |
| Carga de Catálogo & Parametrización | **Clientum** | Equipo Koala |
| Validación de SSL, Webhooks & QA Final | **Clientum** | - |
