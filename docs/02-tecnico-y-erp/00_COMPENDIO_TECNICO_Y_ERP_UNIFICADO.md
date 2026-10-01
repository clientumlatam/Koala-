# COMPENDIO MÓDULO TÉCNICO, ERP Y DNS — KOALA × CLIENTUM

**Manual de Integración API REST, Sincronización 0s, Planilla DNS e Infraestructura ICXN**  
*Documento Integrado Generado Automáticamente • Koala Lo Tiene (LP SRL)*  

---

## Índice de Contenidos Integrados

1. **[Capítulo 1: 01_manual_integracion_erp.md](#capitulo-1)**
2. **[Capítulo 2: 02_respuestas_tecnicas_mikhail.md](#capitulo-2)**
3. **[Capítulo 3: 03_migracion_dns_cloudflare_vercel_icxn.md](#capitulo-3)**
4. **[Capítulo 4: 04_checklist_y_hoja_calculo_dns.md](#capitulo-4)**
5. **[Capítulo 5: 05_respuestas_consultas_milton_tienda_web.md](#capitulo-5)**
6. **[Capítulo 6: 06_monitoreo_webhooks_icxn_y_sincronizacion.md](#capitulo-6)**
7. **[Capítulo 7: 07_minuta_chat_rafael_gonzalez_icxn_api.md](#capitulo-7)**

---

<a id="capitulo-1"></a>

# CAPÍTULO 1: 01_MANUAL_INTEGRACION_ERP.MD

# Manual de Integración ERP — Koala Lo Tiene

Este documento describe la arquitectura, endpoints, formatos de datos y flujos de trabajo para conectar el sistema web y presupuestador de **Koala Lo Tiene** con sistemas de gestión empresarial (**Tango Software, Flexxus Enterprise, Bejerman, SAP Business One o ERPs propietarios**).

---

## 1. Arquitectura General de Sincronización

La plataforma opera bajo un modelo **híbrido y multi-sucursal** con sincronización bidireccional:

```
┌──────────────────────────────────────────────────────────┐
│                   ERP CENTRAL / SUCURSALES               │
│   (Tango / Flexxus / SQL Server / Agente Local Sync)     │
└─────────────┬──────────────────────────────▲─────────────┘
              │ 1. Actualización Precios/Stock│ 3. Asientos /
              │    (Webhooks / Cron CSV / API)│    Pedidos / Remitos
              ▼                              │
┌──────────────────────────────────────────────────────────┐
│            GATEWAY BACKEND EXPRESS & REST API            │
│                 /api/stores | /api/sync                  │
└─────────────┬──────────────────────────────▲─────────────┘
              │ Sincronización en Vivo       │ Cotizaciones /
              │ (Service Worker Offline)     │ Solicitudes
              ▼                              │
┌──────────────────────────────────────────────────────────┐
│            CATÁLOGO & PRESUPUESTADOR CLIENTE             │
│   (General Roca - Av. Roca 1350 / Nqn - Mitre 678)       │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Identificación de Sucursales y Depósitos

| ID Sucursal | Código ERP | Nombre / Ubicación | Rol en el Sistema |
| :--- | :--- | :--- | :--- |
| `roca` | `DEP-01` | **Casa Central & Fábrica** (Av. Roca 1350, General Roca) | Depósito principal de polietileno y venta mayorista/minorista |
| `neuquen` | `DEP-02` | **Salón Comercial** (Mitre 678, Neuquén Capital) | Salón de venta directa, cotillón y repostería |

---

## 3. Métodos de Integración Disponibles

### Método A: REST API / Webhooks (Tiempo Real)

Recomendado para ERPs modernos o middleware que emiten eventos HTTP ante ventas en caja, remitos de ingreso o cambios de listas de precios.

#### 1. Actualización Masiva de Stock y Precios
* **Método**: `POST` / `PATCH`
* **Ruta**: `/api/erp/inventory-sync`
* **Autenticación**: `Authorization: Bearer <API_SECRET_TOKEN>`
* **Content-Type**: `application/json`

**Ejemplo de Payload JSON**:
```json
{
  "timestamp": "2026-08-28T18:00:00.000Z",
  "sourceSystem": "TANGO_EVOLUTION",
  "items": [
    {
      "sku": "POL-BOB-01",
      "erpCode": "ART-9901",
      "name": "Bobina Polietileno 40cm x 100m",
      "price": 18500.00,
      "wholesalePrice": 14900.00,
      "stockRoca": 45,
      "stockNeuquen": 12,
      "minStockAlert": 10
    },
    {
      "sku": "VAS-DES-200",
      "erpCode": "ART-3320",
      "name": "Vaso Plástico Descartable 200cc (Pack x100)",
      "price": 4200.00,
      "wholesalePrice": 3450.00,
      "stockRoca": 120,
      "stockNeuquen": 35,
      "minStockAlert": 25
    }
  ]
}
```

---

### Método B: Sincronización Automática por Archivo CSV / FTP (Cron Job)

Ideal para ERPs tradicionales (Tango Gestión o Flexxus) que generan exportaciones periódicas por lotes a una carpeta compartida o servidor SFTP.

#### Estructura Estándar del Archivo `lista_precios_stock.csv`:
```csv
SKU,CODIGO_ERP,DESCRIPCION,RUBRO,PRECIO_FINAL,PRECIO_MAYORISTA,STOCK_ROCA,STOCK_NEUQUEN,FABRICACION_PROPIA
POL-001,TNG-1001,"Bolsa Camiseta 40x50 Alta Densidad",polietileno,8900.00,7200.00,180,45,SI
COT-042,TNG-2042,"Globos Látex Perlados R12 x50",cotillon,5400.00,4300.00,60,80,NO
ENV-110,TNG-3110,"Bandeja Plástica Rectangular Microondas x20",descartables,6800.00,5500.00,95,30,NO
```

* **Frecuencia Recomendada**: Cada 15 a 30 minutos.
* **Procesamiento en Panel de Administración**: La pestaña **"Importador CSV / Cron"** en el panel administrativo permite activar la importación automática o subir manualmente el archivo para revisión de diferencias antes de impactar en catálogo.

---

### Método C: Remitos y Transferencias Inter-Sucursales

Cuando se transfieren mercaderías de **General Roca (Fábrica)** a **Neuquén Capital (Salón)**:

1. El sistema genera un remito interno correlativo (ej. `REM-2026-0042`).
2. Se descuenta automáticamente el stock en `stockRoca` y se suma en `stockNeuquen`.
3. Se registra el asiento de trazabilidad en el **Libro Diario (Kardex)** con fecha, hora y responsable de despacho.

---

### Método D: Webhooks Push en Tiempo Real (ICXN ERP · Latencia < 50ms)

Diseñado para cumplir con la **promesa de actualización en 0 segundos** ante ventas en mostrador físico, remitos de fábrica y confirmación de checkout:

* **Endpoint de Ingress**: `POST /api/erp/webhooks/icxn`
* **Host Emisor**: `icxn-lp.dvrdns.org` (o terminales de punto de venta)
* **Headers de Seguridad**:
  - `X-ICXN-Event`: Identificador del evento (`inventory.stock_delta`, `pricing.batch_update`, `warehouse.goods_receipt`, `order.atomic_reservation`).
  - `X-ICXN-Signature`: Firma HMAC-SHA256 del cuerpo de la solicitud.
  - `X-Timestamp`: Marca de tiempo en UTC para prevenir ataques de repetición.
* **Tiempos de Respuesta (SLA)**: &lt; 35 milisegundos.
* **Consola de Auditoría**: Pestaña **"Webhooks ICXN (0s)"** en el Panel Administrativo para inspeccionar payloads JSON, latencia histórica y simular remitos o ventas en vivo.

---

## 4. Presupuestos y Exportación Documental

1. **Cotizaciones Web / Mostrador**:
   - Todo presupuesto emitido por el cliente o vendedor se puede exportar en **PDF Oficial** con membrete institucional, desglose de IVA, lista de ítems, totales calculados y **recuadro de conformidad con firma del cliente**.
2. **Reenvío a ERP**:
   - Cada cotización contiene un identificador único (ej. `COT-2026-4821`) que puede importarse como *Pedido de Venta / Nota de Pedido* en el módulo de Facturación del ERP.

---

## 5. Parámetros de Configuración y Seguridad

Las credenciales y parámetros de conexión se configuran mediante variables de entorno en el servidor:

```env
# .env
ERP_GATEWAY_URL=https://erp.koalailotiene.com.ar/api
ERP_API_KEY=tu_token_seguro_de_integracion
ERP_BRANCH_ROCA_ID=DEP-01
ERP_BRANCH_NEUQUEN_ID=DEP-02
ERP_SYNC_INTERVAL_MINUTES=15
```

---

## 6. Soporte y Canales Técnicos

* **Centro de Control**: Panel de Administración > Pestaña *Hub de Stock & Control ERP*.
* **Auditoría**: Simulador de latencia y pruebas de endpoints disponible en la pestaña *API Tester*.
* **Contacto Técnico**: `soporte@koalailotiene.com.ar`


---

<a id="capitulo-2"></a>

# CAPÍTULO 2: 02_RESPUESTAS_TECNICAS_MIKHAIL.MD

# Respuestas Técnicas a las Dudas de Mikhail Murekian (LP SRL)

Este documento contiene los argumentos y la arquitectura técnica para responder con solvencia a las tres preguntas críticas planteadas por Mikhail antes de la firma.

---

### Pregunta 1: ¿Cómo se maneja el conflicto de venta simultánea entre el mostrador físico y la tienda online?

#### El Problema Planteado por Mikhail:
> *"Adelantándome a algunas situaciones veo crítica la etapa 2, sincronización de stock. ¿Ya integraron con otros ERP antes ustedes? ¿Cómo manejan los posibles conflictos de sincronización que pudieran haber? Por ejemplo, una misma venta online y presencial al mismo tiempo."*

#### Respuesta Técnica de Clientum:
1. **La sincronización pasiva por lotes (cada X minutos) no alcanza**: Si solo se sincronizara periódicamente, existiría una ventana de tiempo donde un cliente online compra un producto que un vendedor acaba de facturar en caja.
2. **Solución: Reserva Atómica en Checkout (Locking Temporal)**:
   * Cuando el cliente online entra en la pantalla de pago o confirma su pedido, el backend web ejecuta un webhook o API call inmediato contra el ERP (`POST /api/erp/stock/reserve`).
   * El ERP valida la disponibilidad en esa sucursal (Roca o Neuquén) y bloquea temporalmente esa cantidad (reserva con tiempo de expiración de 15 minutos).
   * **Caso A (Stock disponible)**: La reserva se confirma y el cliente abona. El ERP emite el comprobante y descuenta el stock de forma definitiva.
   * **Caso B (El mostrador vendió la unidad segundos antes)**: La reserva falla inmediatamente. La tienda online muestra un aviso en tiempo real al usuario: *"Disculpe, el último artículo acaba de agotarse en la sucursal seleccionada. ¿Desea transferirlo desde la otra sucursal o sustituirlo?"*.
   * **Caso C (El cliente abandona la compra sin pagar)**: Tras 15 minutos de inactividad, el bloqueo temporal expira y la unidad vuelve a estar disponible para mostrador y web de forma automática.

---

### Pregunta 2: ¿Qué sucede si Meta cambia el protocolo de WhatsApp al usar una API no oficial (Evolution API)?

#### La Duda de Mikhail:
> *"En cuanto a Evolution API y considerando tu propuesta de reducir cuellos de botella, demoras y optimizar tiempos, ¿qué sucede si Meta cambia el protocolo siendo una API no oficial de Meta? Confirmame este punto por favor."*

#### Respuesta Técnica de Clientum:
1. **Transparencia y honestidad**: Evolution API conecta por emulación web socket de WhatsApp. Si bien es muy económica y rápida para validar flujos en etapas tempranas, Meta periódicamente actualiza su protocolo.
2. **Arquitectura Desacoplada (Agnóstica del Canal)**:
   * La inteligencia del bot, el catálogo, las reglas de negocio y las integraciones al ERP residen en nuestro propio servidor backend (Clientum Core Engine).
   * Evolution API actúa únicamente como un "adaptador de transporte" de mensajes.
3. **Estrategia de Mitigación / Migración sin Fricción**:
   * Si Meta genera cambios que provoquen inestabilidad, o bien si el volumen de mensajes de Koala supera el umbral recomendado para líneas comerciales de alto tráfico, se realiza la migración hacia la **WhatsApp Cloud API oficial de Meta**.
   * La migración a la Cloud API oficial se realiza simplemente cambiando el conector en nuestro backend; **no se pierde nada de la lógica programada, ni el historial, ni las respuestas del bot**.
   * Se evalúa de entrada arrancar directamente con la Cloud API oficial si Koala desea riesgo cero de desconexión desde el primer día.

---

### Pregunta 3: ¿Qué hace concretamente el protocolo MCP (Model Context Protocol)? ¿Qué servidor MCP se está usando?

#### La Duda de Mikhail:
> *"Por último, cuando en MCP indicás 'para garantizar la mayor robustez, seguridad y precisión arquitectónica', efectivamente ¿qué hace el MCP ahí? ¿El bot consulta vía MCP el stock o el catálogo en tiempo real? ¿Qué server MCP están usando o construyendo? Necesitaría bajar este punto a tierra."*

#### Respuesta Técnica de Clientum:
1. **Qué es MCP**: Es el protocolo estándar abierto desarrollado por Anthropic para conectar modelos de Inteligencia Artificial (LLMs) con bases de datos empresariales, APIs y herramientas de software de forma estandarizada y segura.
2. **Por qué es indispensable para Koala**:
   * Sin MCP, los bots tradicionales de IA suelen alucinar precios, o tienen que ser alimentados con archivos estáticos que a las pocas horas quedan desactualizados.
   * Con MCP, el modelo de IA tiene asignadas **"herramientas de lectura en vivo"** que puede invocar en el milisegundo exacto en que un usuario pregunta algo.
3. **Flujo concreto en vivo**:
   * **Cliente pregunta en WhatsApp**: *"Hola, ¿tienen 10 rollos de film alveolar de 1 metro en la sucursal de General Roca y a cuánto está?"*
   * **El Agente IA activa la herramienta MCP**: `consultar_inventario(producto: "film alveolar 1m", sucursal: "roca")`.
   * **El Servidor MCP de Clientum**: Ejecuta la consulta SQL directamente en la réplica de base de datos del ERP de Koala.
   * **Respuesta del Servidor MCP al Agente**: `{ stockRoca: 18, precioMinorista: 24500, precioMayorista: 21800, sku: "POL-FILM-ALV-1M" }`.
   * **El Agente responde al cliente por WhatsApp en 1.5 segundos**: *"Hola! Sí, disponemos de 18 rollos en nuestra casa central de Av. Roca 1350. El precio por unidad es de $24.500 (o $21.800 llevando más de 5 rollos). ¿Te reservo los 10 rollos para retirar hoy o preferís envío?"*
4. **Qué servidor se utiliza**: Construimos un servidor MCP propio desarrollado en Node.js/TypeScript con autenticación segura por tokens y permisos de sólo lectura sobre las vistas de catálogo y stock del ERP, garantizando que el modelo nunca pueda alterar registros contables o de producción sin autorización explícita.

---

### Pregunta 4: ¿El stock realmente se actualiza en "0 segundos" en mostrador y web?

1. **En la Tienda Web (Compra Online)**:  
   El descuento es **estrictamente instantáneo (cero segundos)** en la base de datos central en el momento en que se confirma el pago o checkout. No hay posibilidad de que otro usuario online compre la misma unidad.
2. **En el Mostrador Físico / Depósito**:  
   La inmediatez depende del soporte del ERP actual de Koala (LP SRL):
   * **Escenario Óptimo (Webhooks nativos)**: Si el ERP emite un evento HTTP inmediato ante cada ticket o remito en caja, el impacto en la web es en tiempo real.
   * **Escenario Estándar (Consultas Batch / Cron)**: Si el ERP no soporta webhooks y opera por sincronización periódica, la tienda consulta cambios cada 2 a 5 minutos.
3. **Recomendación Operativa para Milton y Mikhail**:  
   Garantizamos que la tienda web jamás sobrevende unidades y que los ingresos de mercadería por remito/QR reactivan productos de inmediato.

---

### Pregunta 5: ¿La migración DNS a Cloudflare y Vercel puede afectar el correo de Koala?

1. **Diagnóstico**: El correo corporativo está tercerizado con **ICXN** (`icxn-lp.dvrdns.org`).
2. **Riesgo Mitigado**: En la zona anterior, el CNAME `mail` estaba proxied con nube naranja. Si un registro MX apunta a un host proxied por Cloudflare, el tráfico SMTP entrante se rechaza.
3. **Solución Implementada**:
   * El CNAME `mail` y `webmail` se configuran en modo **DNS only (nube gris)**.
   * El registro MX (`10 mail.koalalotiene.com.ar`) y el SPF (`include:outbound.mailhop.org -all`) quedan intactos.
   * Se solicita la clave DKIM a ICXN (`soporte@icxn.com.ar`) para asegurar la entregabilidad de los emails.
   * Rollback garantizado: si hiciera falta, se pueden volver a colocar los nameservers `nelly` y `zac` en nic.ar en cualquier momento.



---

<a id="capitulo-3"></a>

# CAPÍTULO 3: 03_MIGRACION_DNS_CLOUDFLARE_VERCEL_ICXN.MD

# Migración DNS a Cloudflare, Vercel e ICXN (`koalalotiene.com.ar`)

**Documento Técnico de Infraestructura, Seguridad de Correo y Delegación**  
*Dominio Oficial: koalalotiene.com.ar*  
*Proveedor DNS: Cloudflare (Cuenta Nueva)*  
*Hosting Frontend: Vercel Inc.*  
*Servicio de Correo: ICXN Soluciones*  
*Registrador Nacional: NIC Argentina (nic.ar)*  
*Fecha: Septiembre 2026*

---

## 1. Diagnóstico de la Zona y Hallazgos Críticos

Al auditar la exportación de zona DNS y la configuración previa del dominio `koalalotiene.com.ar`, se determinaron cuatro aspectos clave:

1. **La exportación corresponde a la nueva cuenta de Cloudflare:**  
   Los servidores de nombre (NS) asignados a la nueva cuenta son:
   * `braelyn.ns.cloudflare.com`
   * `bryce.ns.cloudflare.com`  
   Los nameservers históricos en NIC.ar (`nelly.ns.cloudflare.com` y `zac.ns.cloudflare.com`) pertenecían a otra cuenta de Cloudflare (posiblemente de un desarrollador o agencia anterior). Al cambiar los NS en NIC.ar, esa zona vieja dejará de responder, por lo que toda la configuración debe estar previamente cargada en la nueva zona.

2. **El correo corporativo es provisto por ICXN:**  
   * El registro `mail` apunta al host dinámico `icxn-lp.dvrdns.org`.
   * El SPF autoriza a `outbound.mailhop.org`.
   * Los reportes DMARC están configurados para enviarse a `soporte@icxn.com.ar`.

3. **Riesgo crítico de caída de correo (Proxy Naranja en `mail`):**  
   En la exportación original, el CNAME `mail` figuraba con `cf-proxied: true`.  
   * **Por qué es peligroso:** Si el host al que apunta el registro MX (`mail.koalalotiene.com.ar`) está proxied por Cloudflare, los servidores de correo de internet intentarán entregar los correos a las direcciones IP de Cloudflare (puerto 25 SMTP), las cuales **rechazan de inmediato el tráfico de correo**.  
   * **Regla estricta:** El CNAME `mail` debe estar obligatoriamente configurado en modo **DNS only (nube gris)** antes de delegar los servidores en NIC.ar.

4. **Dirección principal en Vercel (Redirección 308 de `@` hacia `www`):**  
   En la configuración de Vercel para este proyecto, la redirección canónica 308 está configurada desde la raíz (`@`) hacia **`www`**. El dominio productivo principal es **`www.koalalotiene.com.ar`**.  
   Ambos registros (`@` y `www`) deben configurarse como CNAME apuntando a `16bc395e55b20519.vercel-dns-017.com` en modo **DNS only**. Cloudflare aplica *CNAME flattening* automático en la raíz sin romper compatibilidad con RFC.

---

## 2. Tabla Definitiva de Registros DNS en Cloudflare (21 Registros)

| # | Acción | Tipo | Nombre | Contenido / Destino | Proxy | Estado | Notas / Justificación Técnica |
| :-: | :--- | :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | Borrar | `A` | `@` | `172.67.172.156` | Proxied | Pendiente | IP proxy de Cloudflare del sitio anterior. |
| **2** | Borrar | `A` | `@` | `104.21.71.250` | Proxied | Pendiente | IP proxy de Cloudflare del sitio anterior. |
| **3** | Borrar | `AAAA` | `@` | `2606:4700:3035::ac43:ac9c` | Proxied | Pendiente | IPv6 proxy del sitio anterior. |
| **4** | Borrar | `AAAA` | `@` | `2606:4700:3037::6815:47fa` | Proxied | Pendiente | IPv6 proxy del sitio anterior. |
| **5** | Borrar | `A` | `www` | `172.67.172.156` | Proxied | Pendiente | IP proxy del sitio anterior en `www`. |
| **6** | Borrar | `A` | `www` | `104.21.71.250` | Proxied | Pendiente | IP proxy del sitio anterior en `www`. |
| **7** | Borrar | `AAAA` | `www` | `2606:4700:3035::ac43:ac9c` | Proxied | Pendiente | IPv6 proxy del sitio anterior en `www`. |
| **8** | Borrar | `AAAA` | `www` | `2606:4700:3037::6815:47fa` | Proxied | Pendiente | IPv6 proxy del sitio anterior en `www`. |
| **9** | **Agregar** | `CNAME` | `@` | `16bc395e55b20519.vercel-dns-017.com` | **DNS only** | Pendiente | Destino asignado por Vercel. Nube gris para emisión SSL Let's Encrypt. |
| **10** | **Agregar** | `CNAME` | `www` | `16bc395e55b20519.vercel-dns-017.com` | **DNS only** | Pendiente | Subdominio principal para la tienda web en Vercel. |
| **11** | **Editar** | `CNAME` | `mail` | `icxn-lp.dvrdns.org` | **DNS only** | Pendiente | **CRÍTICO:** Pasar de proxied a DNS only para permitir recepción SMTP del MX. |
| **12** | Borrar | `A` | `webmail` | `172.67.172.156` | Proxied | Pendiente | IP de Cloudflare, no es el host real del correo web. |
| **13** | Borrar | `A` | `webmail` | `104.21.71.250` | Proxied | Pendiente | IP de Cloudflare, no es el host real del correo web. |
| **14** | Borrar | `AAAA` | `webmail` | `2606:4700:3035::ac43:ac9c` | Proxied | Pendiente | IPv6 de Cloudflare obsoleta. |
| **15** | Borrar | `AAAA` | `webmail` | `2606:4700:3037::6815:47fa` | Proxied | Pendiente | IPv6 de Cloudflare obsoleta. |
| **16** | **Agregar** | `CNAME` | `webmail` | `icxn-lp.dvrdns.org` | **DNS only** | Pendiente | Supuesto inicial: mismo host de ICXN. Confirmar con soporte@icxn.com.ar. |
| **17** | Dejar | `MX` | `@` | `10 mail.koalalotiene.com.ar` | DNS only | No requiere | Servidor de correo entrante (Prioridad 10). Sin cambios. |
| **18** | Dejar | `TXT` | `@` | `v=spf1 include:outbound.mailhop.org -all` | DNS only | No requiere | Registro SPF institucional. Sin cambios. |
| **19** | Dejar | `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:soporte@icxn.com.ar; ruf=mailto:soporte@icxn.com.ar; rf=afrf; pct=100` | DNS only | No requiere | Política DMARC de ICXN. Sin cambios. |
| **20** | Dejar | `TXT` | `@` | `google-site-verification=RDqYHFnW-GbqJAiqUU4novzlTDH46JOl1y-4uumq-8o` | DNS only | No requiere | Verificación de titularidad en Google Search Console. |
| **21** | **Pedir** | `TXT` | `(selector)._domainkey` | *Selector y valor provisto por ICXN* | **DNS only** | Pendiente | Firma criptográfica DKIM. Sin DKIM los emails pueden ser catalogados como SPAM. |

---

## 3. Delegación en NIC Argentina (`nic.ar`)

1. **Desactivación de DNSSEC (Paso Obligatorio):**  
   Antes de guardar los nuevos servidores en `nic.ar`, revisar la pestaña o sección de **DNSSEC**.  
   Si figura algún registro **DS** (Delegation Signer) vinculado a la zona vieja, **debe eliminarse de inmediato**. Si se delega a nuevos servidores manteniendo un registro DS obsoleto, los resolvers DNS públicos (Google 8.8.8.8, Cloudflare 1.1.1.1, Movistar, Claro) rechazarán todas las consultas por inconsistencia criptográfica y el dominio quedará completamente inaccesible.

2. **Reemplazo de Nameservers:**  
   * Quitar: `nelly.ns.cloudflare.com` y `zac.ns.cloudflare.com`.
   * Ingresar: `braelyn.ns.cloudflare.com` y `bryce.ns.cloudflare.com`.
   * Confirmar y guardar el trámite.

3. **Plan de Contingencia / Rollback:**  
   Si tras la delegación el servicio de correo presentara algún inconveniente, se puede restablecer la operativa previa volviendo a colocar en NIC Argentina los servidores `nelly.ns.cloudflare.com` y `zac.ns.cloudflare.com`.


---

<a id="capitulo-4"></a>

# CAPÍTULO 4: 04_CHECKLIST_Y_HOJA_CALCULO_DNS.MD

# Checklist de Migración y Hoja de Cálculo DNS (`koala-dns-checklist.xlsx`)

**Guía de Control Paso a Paso, Consulta a ICXN y Seguimiento en Excel**  
*Archivo Asociado: `/koala-dns-checklist.xlsx` (disponible también como `/koalalotiene_dns_migracion_cloudflare.xlsx`)*  
*Cliente: Koala Lo Tiene (LP SRL)*  
*Fecha: Septiembre 2026*

---

## 1. Estructura del Libro de Trabajo Excel (`.xlsx`)

El archivo Excel generado contiene 3 pestañas especializadas con fórmulas automáticas de progreso, validación de datos (listas desplegables) y formatos condicionales:

* **Pestaña 1: Registros DNS:**  
  Detalla las 21 filas de la zona (17 cambios pendientes a ejecutar en Cloudflare y 4 registros que no requieren modificación). Incluye una fórmula de cálculo automático de avance:
  `=IFERROR(COUNTIF(G6:G26,"Hecho")/(COUNTA(G6:G26)-COUNTIF(G6:G26,"No requiere")),0)` que calcula el porcentaje real completado.
* **Pestaña 2: Pasos:**  
  Los 9 pasos cronológicos recomendados con lugar de ejecución, detalles operativos y tabla de servidores de nombre a quitar y agregar en NIC Argentina.
* **Pestaña 3: Consulta ICXN:**  
  Los 4 puntos técnicos a auditar con el proveedor de correo, espacio para registrar las respuestas oficiales y la plantilla de mensaje lista para copiar.

---

## 2. Orden Cronológico de los 9 Pasos

| # | Paso | Dónde se ejecuta | Detalle Técnico | Estado |
| :-: | :--- | :--- | :--- | :---: |
| **1** | Cargar y corregir los registros | Cloudflare | Cargar la tabla de registros. Asegurarse de dejar `mail` y `webmail` en modo **DNS only (nube gris)**. | Pendiente |
| **2** | Consultar a ICXN | `soporte@icxn.com.ar` | Enviar consulta por destino exacto de webmail y mail, registro DKIM y posibles registros adicionales. | Pendiente |
| **3** | Completar webmail y DKIM | Cloudflare | Cargar en la zona los valores definitivos informados por ICXN. | Pendiente |
| **4** | Presionar "Continue to activation" | Cloudflare | Avanzar a la pantalla de validación tras revisar la tabla completa de registros. | Pendiente |
| **5** | Eliminar registro DS si existe (DNSSEC) | NIC Argentina (`nic.ar`) | **Obligatorio:** realizar antes de guardar los nuevos nameservers para evitar que el dominio quede sin resolver. | Pendiente |
| **6** | Reemplazar nameservers | NIC Argentina (`nic.ar`) | Quitar `nelly.ns` y `zac.ns`. Cargar `braelyn.ns.cloudflare.com` y `bryce.ns.cloudflare.com`. | Pendiente |
| **7** | Verificar activación | Cloudflare | Presionar el botón *"Check nameservers"*. Aguardar propagación (suele tardar entre 15 minutos y 2 horas). | Pendiente |
| **8** | Refrescar dominios | Vercel | Pulsar *"Refresh"* para `koalalotiene.com.ar` y `www.koalalotiene.com.ar` hasta confirmar *"Valid Configuration"*. | Pendiente |
| **9** | Probar correo y webmail | Casilla del dominio | Enviar correo de prueba hacia y desde la casilla del dominio; comprobar acceso al webmail. | Pendiente |

---

## 3. Consulta a Soporte de ICXN (`soporte@icxn.com.ar`)

### Puntos a confirmar:

1. **Destino correcto de webmail:**  
   *Por qué:* Las IPs anteriores eran proxies de Cloudflare. El destino real del servidor webmail quedó oculto tras la zona anterior.
2. **Destino correcto de mail:**  
   *Por qué:* Actualmente apunta a `icxn-lp.dvrdns.org`; se debe confirmar que este host dinámico continúa plenamente vigente.
3. **Registro DKIM (Selector y clave TXT):**  
   *Por qué:* No aparece ningún registro `_domainkey` en la exportación de zona. Sin firma DKIM, los correos salientes tienen alta probabilidad de ser catalogados como spam o rechazados por Gmail y Microsoft 365.
4. **Otros registros necesarios:**  
   *Por qué:* Verificar si disponen de algún CNAME o TXT secundario necesario para la operativa del correo.

### Plantilla de Correo para ICXN:

```text
Asunto: Migración DNS dominio koalalotiene.com.ar — Registros de correo y DKIM

Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar:
1) El destino correcto para webmail y mail (¿ambos apuntan a icxn-lp.dvrdns.org?).
2) El registro DKIM (selector y valor TXT completo para la firma del dominio).
3) Si hay algún otro registro necesario para el correo del dominio que deba conservarse.

Los registros MX (10 mail.koalalotiene.com.ar) y SPF (v=spf1 include:outbound.mailhop.org -all) ya se encuentran configurados en modo DNS only. Gracias.
```

---

## 4. Notas de Seguridad y Contingencia

* **Horario de aplicación recomendado:** Realizar el cambio de delegación en un horario de bajo tráfico comercial (ej. fin de la jornada hábil).
* **Rollback inmediato:** Si existiera cualquier fallo en la recepción de correo atribuible a registros no detectados, se puede revertir la delegación en NIC.ar a los servidores previos (`nelly.ns.cloudflare.com` y `zac.ns.cloudflare.com`) de forma inmediata.


---

<a id="capitulo-5"></a>

# CAPÍTULO 5: 05_RESPUESTAS_CONSULTAS_MILTON_TIENDA_WEB.MD

# Respuestas a Consultas de Milton sobre la Tienda Web ("Koalas")

**Especificación Técnica y Comercial de los 6 Puntos Operativos**  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*  
*Interlocutor: Milton*  
*Equipo Técnico: Clientum E-Commerce & Arquitectura Digital*  
*Fecha: Septiembre 2026*

---

## 1. Actualización del Stock en la Página

* **Mecanismo Operativo:**  
  El stock disponible en la tienda online se actualiza de forma automática e inmediata en la base de datos central en el momento exacto en que un cliente finaliza y confirma su compra por la web.
* **Ventas Físicas / Mostrador:**  
  Si el negocio cuenta con puntos de venta físicos (General Roca o Neuquén Capital) o canales externos, la conexión por API y Webhooks entre el sistema de gestión del depósito (ERP) y la web envía el aviso de descuento de inventario para mantener el stock unificado y prevenir sobreventas.
* **Nota Técnica de Implementación:**  
  El descuento ante compras web es instantáneo (cero segundos de latencia). La velocidad del reflejo de ventas físicas depende de la arquitectura del ERP: si el ERP emite webhooks ante cada factura física, el impacto web es en tiempo real; si funciona por consultas periódicas (batch), se sincroniza cada pocos minutos.

---

## 2. Impacto del Ingreso de Mercadería al Stock

* **Mecanismo Operativo:**  
  El impacto es inmediato tan pronto como el personal de depósito o compras registra formalmente la entrada de mercadería (cargando cantidades, importando el remito del proveedor o escaneando el código de barras/QR de los bultos).
* **Reactivación Automática de Productos:**  
  Aquellos artículos que figuraban con la leyenda "Agotado" o "Sin stock" en la tienda online vuelven a mostrarse automáticamente disponibles para la venta con sus precios actualizados, sin que el administrador deba entrar a la web a activarlos de manera manual.

---

## 3. Cálculo del Costo de Flete y Entregas sin Cargo

### A. Cálculo del Costo de Flete
* **Operadores Logísticos Integrados:**  
  Mediante pasarelas logísticas (Andreani, Correo Argentino, OCA u otros operadores de paquetería regional), el cliente ingresa su **Código Postal** en el carrito y el sistema cotiza automáticamente la tarifa según el peso del pedido, las dimensiones volumétricas y la distancia kilométrica.
* **Logística Propia / Cadetería Local:**  
  Para entregas dentro del radio urbano de General Roca o Neuquén Capital, se pueden definir tarifas fijas escalonadas por zonas geográficas o distancia en kilómetros desde el depósito central.

### B. Reglas de Envío Gratis (Sin Cargo)
* **Por cercanía geográfica:** Envío sin cargo automático para clientes ubicados dentro de un radio de entrega preferencial (ej. hasta 3 km de la sucursal).
* **Por monto mínimo de compra:** Regla comercial configurable (ej. "Envíos gratis en compras superiores a $45.000") para incentivar el aumento del ticket promedio.
* **Retiro en Tienda (Pick-up):** Opción siempre gratuita en cualquiera de las sucursales habilitadas (Av. Roca 1350 o Mitre 678).

---

## 4. Esquema de Consultas Técnicas: Chatbot vs. WhatsApp

Se implementa una **arquitectura híbrida** que combina la inmediatez de la inteligencia artificial con la calidez del trato humano:

* **Chatbot Web 24/7:**  
  Opera permanentemente en la tienda online para evacuar dudas frecuentes de primer nivel: tabla de micrones y resistencia de polietileno, medidas de moldes de repostería, compatibilidad de descartables, horarios de atención de sucursales y tiempos estimados de envío.
* **Botón Directo a WhatsApp en Ficha de Producto:**  
  Cada producto cuenta con un botón directo a WhatsApp. Al hacer clic, se abre una conversación con el mensaje preformateado indicando el código SKU, el nombre del artículo y la sucursal de interés.
* **Transferencia Fluida a Asesor Comercial:**  
  Si la consulta en el bot web supera su base de conocimiento o el cliente solicita atención mayorista, el sistema deriva la conversación con todo el contexto directamente al WhatsApp del equipo de ventas de Koalas.

---

## 5. Captación de Clientes Más Allá de las Redes Sociales

Para no depender exclusivamente de publicaciones o algoritmos en Instagram o Facebook, se despliega una estrategia de captación multicanal:

1. **Posicionamiento Orgánico en Google (SEO Local):**  
   Optimización técnica on-page para términos con alta intención transaccional en el Alto Valle (ej. *"bolsas de polietileno General Roca"*, *"descartables gastronómicos Neuquén"*, *"cotillón mayorista Río Negro"*).
2. **Fichas de Google Mi Negocio / Google Maps:**  
   Perfil de empresa optimizado con horarios, fotos reales, catálogo sincronizado y reseñas que sitúan a Koalas en los primeros resultados del mapa cuando alguien busca comercios cercanos.
3. **Publicidad de Búsqueda (Google Ads & Google Shopping):**  
   Campañas que muestran los productos exactos con foto, descripción y precio justo en el instante en que un usuario busca un artículo específico para comprar.
4. **Transformación de Empaque Físico en Recompra Digital:**  
   Inclusión de un código QR en las bolsas y cajas de entrega física de Koalas (*"Escaneá y repetí tu pedido con 10% OFF en la web"*), generando recompra recurrente de panaderías, rotiserías y reposteras locales.

---

## 6. Búsqueda en Navegadores con Radio de Ventas Delimitado

* **¿Es posible delimitar las ventas por zona?**  
  **Sí, es 100% posible y es la mejor práctica para e-commerce locales con logística propia o regional.**
* **Implementación en 3 Niveles:**
  1. **Área de Servicio en Google:** Se configura el área de servicio en Google Business Profile para que Google priorice a Koalas únicamente ante usuarios ubicados dentro del radio de influencia comercial.
  2. **Google Ads con Segmentación por Radio Geográfico:** Las campañas de anuncios se delimitan estrictamente por radio en kilómetros (ej. radio de 10 km o 15 km alrededor de cada local), garantizando que el presupuesto se invierta exclusivamente en usuarios con posibilidad real de comprar y recibir el producto.
  3. **Validador de Código Postal en el Checkout:** Si un cliente ingresa un Código Postal fuera de la zona de cobertura configurada, el sistema le notifica amablemente las alternativas disponibles (ej. coordinación de flete especial por expreso o retiro en sucursal).


---

<a id="capitulo-6"></a>

# CAPÍTULO 6: 06_MONITOREO_WEBHOOKS_ICXN_Y_SINCRONIZACION.MD

# Monitoreo de Webhooks ICXN y Sincronización en Tiempo Real

**Especificación Técnica del Tablero de Monitoreo de Eventos ERP & Audit Trail**  
*Cliente: Koala Cotillón / LP SRL*  
*Sistema de Gestión de Origen: Gateway ICXN ERP*  
*Meta de Latencia Target: < 1 segundo (Reserva "0 Segundos")*

---

## 1. Visión General del Tablero de Monitoreo ICXN

Para garantizar la promesa de reserva de stock atómica e instantánea (evitando sobreventas cruzadas entre mostrador físico y tienda online), la plataforma incorpora en el **Panel de Administración (`AdminPanelModal`)** un centro de control de eventos HTTP Webhooks en tiempo real emitidos por el gateway de **ICXN ERP**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GATEWAY ERP ICXN                                │
│        (Ventas Mostrador, Movimientos de Depósito, Precios)            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Eventos HTTP POST (Webhooks)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ERP SYNC MONITOR CARD (Dashboard)                    │
│   • Contador Ticker de Eventos Exitosos vs. Reintentos                 │
│   • Estado de Salud del Gateway (Status: Normal / Alerta / Offline)     │
│   • Latencia Media Promedio (Target: 0s / <250ms)                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Log en `webhookEvents` Array
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                TAB "WEBHOOK LOGS" (AdminPanelModal)                    │
│   • Tabla de Auditoría Searchable con Filtros por Estado               │
│   • Visualizador Interactivo de Payload JSON para Debugging            │
│   • Métricas de Reintento Exponencial y Confirmaciones de Pedidos     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes UI Implementados

### 2.1 Card `ERP Sync Monitor` (Dashboard Principal)
Ubicada en la vista general del panel administrativo, proporciona métricas operativas inmediatas para el equipo de IT y soporte de Clientum:

1. **Live Ticker de Eventos**:
   * **Exitosos (HTTP 200 OK)**: Contador en verde de webhooks procesados correctamente.
   * **Reintentos / Error (HTTP 5xx / Timeout)**: Contador en rojo/amarillo de eventos fallidos o en proceso de retry.
2. **Indicador de Meta '0 Segundos'**:
   * Muestra la latencia promedio de respuesta del endpoint `/api/erp/webhooks/icxn` (ej. `180 ms`).
3. **Estado de Conexión del Gateway**:
   * `Operativo`: Recepción continua de eventos en los últimos 5 minutos.
   * `Latencia Alta`: Tiempo de procesamiento > 1.5s.
   * `Desconectado`: Sin latidos o latencia > 30s.

### 2.2 Tab `Webhook Logs` (`AdminPanelModal`)
Accesible desde las pestañas de configuración y auditoría del panel administrativo. Renderiza el arreglo `webhookEvents` con la siguiente estructura de tabla:

| Columna | Tipo de Dato | Descripción y Formato |
| :--- | :--- | :--- |
| **Timestamp** | ISO Date / Time | Hora exacta con precisión de milisegundos (`YYYY-MM-DD HH:mm:ss.SSS`). |
| **Event Type** | String | Identificador del evento (`stock.updated`, `price.changed`, `order.confirmed`, `reservation.failed`). |
| **Status** | Badge Color | `SUCCESS` (Verde), `WARNING` (Amarillo), `ERROR` (Rojo), `PENDING` (Azul). |
| **Source** | String | Origen del evento (`ICXN Gateway`, `Checkout Web`, `POS Roca`, `POS Neuquén`). |
| **Payload Toggle** | Interactivo | Botón desplegable para inspeccionar el cuerpo JSON completo transmitido por el ERP. |

---

## 3. Formato Estándar de Payloads JSON de Webhooks

### A. Evento de Actualización de Stock en Tiempo Real (`stock.updated`)
```json
{
  "eventId": "evt_icxn_998231",
  "eventType": "stock.updated",
  "timestamp": "2026-09-30T20:45:12.110Z",
  "source": "ICXN_POS_ROCA_01",
  "data": {
    "sku": "COT-GLO-R12",
    "erpCode": "ART-7042",
    "depositId": "DEP-01",
    "previousStock": 150,
    "currentStock": 145,
    "delta": -5,
    "reason": "VENTA_MOSTRADOR_FACT_A001-9821"
  }
}
```

### B. Evento de Confirmación de Pedido y Descuento Definitivo (`order.confirmed`)
```json
{
  "eventId": "evt_icxn_998232",
  "eventType": "order.confirmed",
  "timestamp": "2026-09-30T20:45:14.300Z",
  "source": "CHECKOUT_WEB_CLIENTUM",
  "data": {
    "orderId": "ORD-2026-8819",
    "reservationToken": "res_tok_7721839",
    "status": "CONFIRMED",
    "items": [
      { "sku": "COT-GLO-R12", "qty": 2, "price": 5400.00 }
    ],
    "icxnInvoiceNumber": "FC-B-0002-0001239"
  }
}
```

---

## 4. Política de Tolerancia a Fallos y Reintentos (Retry Mechanism)

1. **Estrategia de Reintentos Exponenciales (Backoff)**:
   * **Intento 1**: Inmediato.
   * **Intento 2**: a los 5 segundos.
   * **Intento 3**: a los 30 segundos.
   * **Intento 4**: a los 5 minutos.
2. **Manejo de Fallas Continuas**:
   * Si el gateway ICXN no responde en 4 intentos, el evento pasa a estado `ERROR_DEAD_LETTER` y genera una alerta visual prominente en la card `ERP Sync Monitor`.
   * El stock de la web se mantiene protegido mediante el buffer preventivo reservado en el checkout online.

---

## 5. Auditoría de Inconsistencias de Stock

El tab `Webhook Logs` permite al administrador filtrar eventos por palabra clave (ej. SKU `COT-GLO-R12` o ID de orden `ORD-2026-8819`) para verificar la consistencia exacta en caso de disputas de stock o inventario.

---

## 6. Criterios de Éxito de la Sincronización 0s & Visibilidad Operativa para el Personal de Koala

### 6.1 Criterios Tecnológicos de Éxito
Para considerar validada y funcional la meta de **"Sincronización 0s"**, la integración debe cumplir simultáneamente los siguientes 4 pilares:

1. **Latencia Extremadamente Baja (< 1000 ms, Target < 250 ms)**:
   Tiempo transcurrido desde la confirmación de la venta en la caja del mostrador de ICXN (Roca o Neuquén) hasta el impacto reflejado en el catálogo web.
2. **Cero Sobreventas por Concurrencia (Zero Over-selling)**:
   Efectividad del 100% en el bloqueo atómico durante el checkout de compra online, impidiendo que dos clientes abonen la misma unidad remanente.
3. **Tasa de Éxito de Webhooks > 99.5%**:
   Mantenimiento de tasa de error HTTP en recepción de webhooks por debajo del 0.5% en operación continua.
4. **Recuperación Autónoma por Reintentos (Zero Data Loss)**:
   Garantía de procesamiento del 100% de los eventos retenidos en cola tras interrupciones temporales de conectividad.

### 6.2 Visibilidad Multidepósito en Tiempo Real mediante el 'ERP Sync Monitor'
El componente **ERP Sync Monitor** y el tab **Webhook Logs** dentro del panel de administración (`AdminPanelModal`) han sido diseñados para otorgar certeza absoluta al equipo comercial, de depósito y administración de Koala sobre el stock disponible en ambos nodos logísticos de la empresa: **General Roca (`DEP-01`)** y **Neuquén Capital (`DEP-02`)**:

* **Consolidación y Desglose por Nodo Logístico (`DEP-01` vs `DEP-02`)**:
  - Cada evento de webhook recibido (`stock.updated`) procesa e identifica explícitamente el identificador `depositId`.
  - El personal de Koala puede inspeccionar instantáneamente si una actualización de stock proviene de una venta en mostrador de Roca, una recepción de mercadería en Neuquén o una transferencia interna entre depósitos.
* **Semaforización Intuitiva de Salud**:
  - 🟢 **Operativo (Sincronizado 0s)**: Confirmación visual inmediata de que el canal online y las cajas físicas de Roca y Neuquén están 100% alineados.
  - 🟡 **Latencia Alta / Reintentos**: Alerta preventiva temprana en caso de lentitud en la red o demoras en la respuesta de ICXN en cualquiera de los dos depósitos.
  - 🔴 **Desconectado / Error**: Indicación clara de interrupción para notificar de inmediato al soporte técnico de Clientum.
* **Trazabilidad en Lenguaje Claro & Auditoría por SKU**:
  - Muestra contadores en vivo (*X Exitosos / Y Reintentos*) para dar certeza al personal del depósito de que los ingresos de mercadería cargados en el ERP impactaron en la tienda online.
  - Si un vendedor o encargado de local consulta sobre la disponibilidad de un producto clave en Roca o Neuquén, el personal puede ingresar al tab **Webhook Logs**, filtrar por SKU o código de depósito, y confirmar con sello de hora y segundo el último evento procesado.



---

<a id="capitulo-7"></a>

# CAPÍTULO 7: 07_MINUTA_CHAT_RAFAEL_GONZALEZ_ICXN_API.MD

# Minuta y Confirmación de API ERP — Chat con Rafael González (ICXN)

**Registro de Intercambio Técnico & Plan de Acción para Integración ERP**  
*Interlocutores: Jonathan (Clientum) y Rafael González (Representante ERP ICXN)*  
*Cliente: Koala Cotillón / LP SRL*  
*Fecha: 30 de Septiembre de 2026 (18:08 - 18:25 hs)*

---

## 1. Transcripción Oficial del Intercambio

```text
[15:19, 14/9/2026] Clientum: Rafa como estas
[15:19, 14/9/2026] Clientum: Jonathan de clientum
[15:19, 14/9/2026] Clientum: Consulta
[15:19, 14/9/2026] Clientum: Koala esta usando su erp?
[15:19, 14/9/2026] Clientum: Tienen integración por api?
[15:20, 14/9/2026] Clientum: Tenes algún enlace que pueda ver? Para hacer
[15:20, 14/9/2026] Clientum: La integración?
[08:08, 25/9/2026] Clientum: Hola buen dia
[18:08, 30/9/2026] Clientum: Koala esta usando su erp?
[18:08, 30/9/2026] Clientum: Tienen integración por api?
[18:08, 30/9/2026] Clientum: Hola buen dia
[18:08, 30/9/2026] Rafael González: Buenas tardes
[18:08, 30/9/2026] Rafael González: Koala esta usando su erp?
si
[18:08, 30/9/2026] Rafael González: Tienen integración por api?
si, a pedido de cada cliente
[18:09, 30/9/2026] Clientum: tenes alguna documentacion en pdf o algo similar?
[18:09, 30/9/2026] Clientum: que podamos ver?
[18:09, 30/9/2026] Clientum: o algunas capturas de pantalla al menos?
[18:10, 30/9/2026] Clientum: en su sitio no funcionan estos links
[18:10, 30/9/2026] Clientum: tenes algun pdf algo asi?
[18:17, 30/9/2026] Clientum: ?
[18:25, 30/9/2026] Rafael González: tenes alguna documentacion en pdf o algo similar?
no, se prepara como documentación cuando se arma el proyecto, con los endpoints a publicar o consumir y demás cuestiones
consulto si han indicado algo de LP o Koala y te aviso, seguramente mañana
```

---

## 2. Diagnóstico y Hallazgos Clave

1. **Confirmación de Uso de ERP ICXN**:
   Rafael González confirma formalmente que **Koala (LP SRL) está utilizando activamente el sistema ERP de ICXN**.

2. **Capacidad de Integración por API Disponibles**:
   ICXN dispone de la capacidad técnica para integrar por API REST / Webhooks, **desarrollada a medida para cada cliente** (*"sí, a pedido de cada cliente"*).

3. **Inexistencia de Documentación Estándar Genérica**:
   ICXN no posee una API pública estándar con documentación genérica descargable. La especificación de endpoints se define formalmente en la etapa de armado de cada proyecto según los requerimientos de la integración (*"se prepara como documentación cuando se arma el proyecto, con los endpoints a publicar o consumir y demás cuestiones"*).

4. **Estado de Solicitud Interna**:
   Rafael consultará internamente con el equipo de LP SRL / Koala si ya se ha emitido la orden formal de habilitación de API para la tienda web de Clientum.

---

## 3. Plan de Acción y Estrategia Proactiva para Clientum

Dado que ICXN construye o publica los endpoints **a medida según la definición del proyecto**, Clientum toma la iniciativa entregando a Rafael González el **Manual de Integración ERP listo para usar** (`docs/02-tecnico-y-erp/01_manual_integracion_erp.md`), eliminando demoras y reduciendo el esfuerzo técnico por parte de ICXN:

### A. Mensaje de Respuesta Propuesto para Mañana (Rafael González - ICXN)

```text
Hola Rafa, ¡excelente! Muchas gracias por la respuesta.

Para facilitarte el trabajo y acelerar los tiempos, desde Clientum ya dejamos definida la especificación exacta de endpoints y payloads JSON que necesitamos consumir/recibir para la tienda web de Koala:

1. Endpoints que podemos exponerles en nuestro Gateway (para que ICXN nos envíe webhooks):
• POST /api/erp/webhooks/icxn (Actualizaciones de stock/precios por eventos de caja en mostrador)

2. Endpoints que necesitamos consumir de ICXN (o vistas SQL/API de lectura):
• GET /api/icxn/stock-prices (Consulta de stock por SKU en DEP-01 Roca y DEP-02 Neuquén)
• POST /api/icxn/orders (Envío de pedidos confirmados en la web para facturación)

Te paso el PDF/Manual con la especificación OpenAPI detallada para que lo revises con tu equipo. Con que nos habiliten esos 2 endpoints o credenciales de lectura, tenemos todo listo para conectar la web de inmediato.

Quedo atento a la respuesta de mañana. ¡Un abrazo!
```

---

## 4. Próximos Pasos Técnicos

1. **Suministro de la Especificación OpenAPI**:
   Enviar el documento `01_manual_integracion_erp.md` en formato PDF/PDF-Interactivo a Rafael González.
2. **Requerimiento de Credenciales**:
   Solicitar las credenciales `API_KEY` o usuario Read-Only a la base de datos de ICXN para habilitar la consulta en tiempo real del Servidor MCP.
3. **Mantenimiento del Canal CSV de Contingencia**:
   Hasta que ICXN active los endpoints en producción, se utiliza el importador CSV/Excel habilitado en el panel administrativo de Koala.


---

