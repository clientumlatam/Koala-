# Documento de Revisión y Análisis de Consistencia Integral — Koala Lo Tiene (LP SRL)

**Auditoría de Propuesta Comercial, Respuestas Técnicas y Estrategia de Comunicación**  
*Cliente: Koala Cotillón, Descartables, Repostería y Polietileno (LP SRL)*  
*Elaborado por: Clientum — IA para PyMEs*  
*Fecha: Septiembre 2026*

---

## 1. Contexto y Objetivos del Análisis

A partir de la revisión cruzada entre la **Propuesta Comercial Unificada**, las respuestas enviadas a Mikhail Murekian, los mensajes dirigidos a Milton y el estado técnico real de la infraestructura (Cloudflare / Vercel / ICXN ERP), se identificaron inconsistencias clave de negocio y técnicas que deben alinearse antes de formalizar el envío a la dirección de Koala.

---

## 2. Los Seis Problemas Principales Identificados y su Resolución

### 2.1 Plazos de Puesta en Marcha (Estandarización en 10 Días Hábiles)
* **Conflicto**: Se mencionaban plazos de "2 a 5 días" en algunos textos y "10 días hábiles" en la propuesta formal.
* **Resolución**: Se estandariza el cronograma oficial en **10 días hábiles**, aclarando que la tienda en **dirección provisoria** se encuentra visible en 2 a 5 días para revisiones internas de catálogo, pero el lanzamiento público oficial requiere los 10 días completos:
  * **Etapa 1 (Días 1 a 3)**: Estructura web, diseño base, medios de pago y envío.
  * **Etapa 2 (Días 4 a 8)**: Carga de catálogo/ERP, reglas logísticas de flete y automatización de WhatsApp.
  * **Etapa 3 (Días 9 a 10)**: Pruebas integrales de compra, validación de stock y salida a producción.

### 2.2 Sincronización de Stock y Claridad sobre "0 Segundos"
* **Conflicto**: Se prometió reserva en "0 segundos" frente a ventas físicas de mostrador.
* **Resolución**: El descuento de stock es instantáneo **durante el checkout online en la web** mediante reserva atómica temporal. Sin embargo, el impacto de una venta física realizada en el mostrador del depósito depende de la frecuencia de sincronización de ICXN. Se comunica a Milton y Mikhail de manera directa y sin rodeos, evitando justificativos infundados como "para cuidar el performance".

### 2.3 Evolución API vs. WhatsApp Cloud API Oficial
* **Inconsistencia**: La propuesta comercial promete la API Oficial de WhatsApp, mientras que las respuestas iniciales mencionaban Evolution API (solución no oficial).
* **Resolución**: Se establece una arquitectura desacoplada donde el bot de IA opera sobre un backend propio independiente del canal. Se inicia la fase 1 con la conexión disponible y se deja planteada la migración a la **WhatsApp Cloud API oficial (Meta)** para cuentas de alto volumen, eliminando cualquier riesgo de bloqueo o cambio de protocolo.

### 2.4 Servidor MCP Protocol y Acceso a Base de Datos ERP
* **Inconsistencia**: La lista de requerimientos previa no solicitaba credenciales de lectura para el servidor MCP.
* **Resolución**: Para que el servidor MCP (Model Context Protocol) consulte en tiempo real stock y precios sin alucinaciones, se requiere explícitamente a Milton/Mikhail un **usuario con permisos de lectura (SQL Read-Only o REST API Read-Only)** sobre el ERP de Koala.

### 2.5 Alcance Prometido vs. Ítems sin Precio Desglosado
* **Omisión**: Se mencionaban características avanzadas (Google Ads, Shopping, QR 10% OFF, Club Koala, fotos profesionales) sin aclarar si están incluidas en la Etapa 1 o son add-ons de etapas posteriores.
* **Resolución**: Se delimita el alcance de la **Etapa 1 (Tienda Online WooCommerce/React)** e integraciones clave, marcando los servicios complementarios de pauta publicitaria y fidelización como módulos de la Etapa 2/3 o contrataciones adicionales.

### 2.6 Estado Real del Dominio y Configuración DNS / Vercel
* **Inconsistencia**: La propuesta previa describía el DNS como "ya resuelto", cuando en realidad la delegación en NIC Argentina se encuentra pendiente.
* **Resolución**: Se especifica que el dominio `koalalotiene.com.ar` requiere la delegación formal en NIC Argentina a los nameservers de Cloudflare (`braelyn.ns.cloudflare.com` y `bryce.ns.cloudflare.com`), con registros CNAME en Vercel (`16bc395e55b20519.vercel-dns-017.com` en modo **DNS only / nube gris**) y modo DNS-only en `mail` para no interrumpir el servicio de correo de ICXN.

---

## 3. Las Cuatro Correcciones Clave en la Comunicación con Milton

1. **Aclaración sobre la Dirección Provisoria**:
   * Usar el término **"dirección provisoria"** en lugar de "dirección provisoria interna", reconociendo que `koala-flame-seven.vercel.app` es una URL accesible públicamente para revisiones.
2. **Propagación DNS en Horario Tranquilo**:
   * Reemplazar las frases "de madrugada" o "corte programado" por **"cambio en un horario tranquilo"**, explicando con transparencia que la propagación de nameservers en NIC Argentina toma entre minutos y pocas horas sin interrumpir el servicio si los registros MX y CNAME mail se mantienen en DNS only.
3. **Explicación Honesta de Sincronización de Stock**:
   * Eliminar excusas inventadas. Explicar sencillamente que el checkout web reserva el stock al instante en la tienda online, y que la sincronización con las cajas físicas del mostrador se coordina según la capacidad de consulta del ERP.
4. **Tono Directo y Transparente**:
   * Abordar la consulta de Mikhail sobre ventas simultáneas de forma explícita, mostrando solvencia técnica y seguridad en la arquitectura de reservas.

---

## 4. Mensaje Definitivo y Ajustado para Milton (Para reenviar a Mikhail)

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

## 5. Lista de Chequeo de Pendientes para Cierre

- [x] Confirmar plazo oficial unificado en 10 días hábiles.
- [x] Ajustar registros CNAME de Vercel en Cloudflare en modo DNS only (nube gris).
- [x] Asegurar registros MX y CNAME mail/webmail en DNS-only apuntando a `icxn-lp.dvrdns.org`.
- [x] Delegar en NIC Argentina a `braelyn.ns.cloudflare.com` y `bryce.ns.cloudflare.com` (sin registros DS/DNSSEC).
- [x] Solicitar a Milton/Mikhail el usuario de lectura SQL/API para el servidor MCP.
