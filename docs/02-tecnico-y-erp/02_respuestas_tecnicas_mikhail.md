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
