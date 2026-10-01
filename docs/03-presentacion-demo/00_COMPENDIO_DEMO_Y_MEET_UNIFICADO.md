# COMPENDIO MÓDULO DEMO Y PRESENTACIÓN EN VIVO — KOALA × CLIENTUM

**Guía Cronometrada de Demostración y Checklist de Framing**  
*Documento Integrado Generado Automáticamente • Koala Lo Tiene (LP SRL)*  

---

## Índice de Contenidos Integrados

1. **[Capítulo 1: 01_guia_demo_meet.md](#capitulo-1)**
2. **[Capítulo 2: 02_checklist_y_framing_demo.md](#capitulo-2)**

---

<a id="capitulo-1"></a>

# CAPÍTULO 1: 01_GUIA_DEMO_MEET.MD

# Guía de Demostración para Google Meet — Koala Lo Tiene

Esta guía está diseñada para estructurar la reunión de presentación y demostración en vivo con los directores y encargados de **Koala Lo Tiene** (General Roca y Neuquén Capital), asegurando un cierre de venta exitoso para las tres etapas propuestas por Clientum.

---

## 1. Preparación Previa a la Llamada (Checklist de 15 min)

1. **Apertura de Pantallas**:
   - Tener abierta la aplicación en producción / desarrollo.
   - Tener una pestaña de incógnito con Google buscando *"cotillón general roca"* o *"descartables neuquén"* para ilustrar el problema de visibilidad actual.
   - WhatsApp abierto (para simular el envío de presupuestos y pedidos).

2. **Relevamiento Previo (Preguntas tácticas para romper el hielo)**:
   - *"¿Qué sistema ERP están utilizando hoy en el salón y en depósito?"* (Tango, Flexxus, Bejerman, etc.).
   - *"¿Cuál es hoy el porcentaje de ventas que se concreta por WhatsApp en comparación con el mostrador físico?"*.

---

## 2. Estructura de la Reunión (15 - 20 Minutos)

### Minuto 00 - 03: Diagnóstico y Oportunidad
* **Objetivo**: Conectar con el dolor actual del negocio.
* **Discurso**: 
  > *"Hola a todos. Estuvimos analizando el posicionamiento digital de Koala en el Alto Valle. Hoy, cuando un cliente busca artículos de cotillón, repostería o descartables en General Roca o Neuquén, la competencia se queda con esas ventas porque no hay una plataforma e-commerce ágil que refleje el stock real de sus sucursales. Venimos a presentarles una solución integral dividida en 3 etapas concretas para potenciar las ventas online y unificar su operación."*

### Minuto 03 - 08: Demostración de la Etapa 1 (E-commerce + Catálogo + SEO)
* **Acciones en Pantalla**:
  - Mostrar la interfaz limpia, moderna y adaptada a móviles.
  - Mostrar el selector de sucursal (**General Roca - Av. Roca 1350** vs **Neuquén Capital - Mitre 678**).
  - Navegar por las categorías (Polietileno, Descartables, Cotillón, Repostería, Envases PET).
  - Mostrar las fichas de producto con **fotografía profesional sobre fondo blanco (estándar MercadoLibre)** y etiquetas mayoristas/minoristas.

### Minuto 08 - 12: Demostración de la Etapa 2 (Integración ERP y Logística Multi-Sucursal)
* **Acciones en Pantalla**:
  - Explicar cómo el stock se actualiza automáticamente entre ambas sucursales.
  - Mostrar el widget de WhatsApp y el **Simulador de Traspaso Inter-sucursales** (con la barra de progreso animada por la Ruta 22 entre Roca y Neuquén).
  - Explicar el conector con su ERP (Tango / Flexxus / SQL Server) mediante archivos CSV automáticos o Webhooks en tiempo real para que ningún pedido se cargue a mano.

### Minuto 12 - 15: Demostración de la Etapa 3 (Bots Web + WhatsApp + Alertas de Stock)
* **Acciones en Pantalla**:
  - Mostrar el panel de consultas recientes en el widget.
  - Mostrar los **indicadores de disponibilidad en tiempo real** (puntos verdes, amarillos y rojos).
  - Demostrar la función *"Avisarme cuando haya stock"*, donde el cliente ingresa su email para recibir un aviso automático ni bien se reponga mercadería.
  - Mostrar el simulador de cobro con Mercado Pago y comprobante con descuento por transferencia (-5%).

### Minuto 15 - 20: Cierre y Preguntas Frecuentes
* **Pregunta de Cierre**:
  > *"La Etapa 1 la podemos tener operativa y posicionándose en Google en 15 a 17 días. ¿Les parece bien que avancemos con la firma del proyecto para comenzar la semana próxima?"*

---

## 3. Manejo de Objeciones Frecuentes

| Objeción del Cliente | Respuesta Recomendada |
| :--- | :--- |
| **"Nuestros precios cambian seguido por la inflación."** | *"El sistema permite actualizar listas completas de precios e-commerce mediante un archivo CSV o sincronización directa con su ERP en menos de 2 minutos."* |
| **"Tenemos stock físico diferente en Roca que en Neuquén."** | *"La plataforma maneja stock multi-depósito independiente. El cliente elige su sucursal de preferencia o ve si hay stock en la otra para solicitar un traspaso logístico."* |
| **"¿Quién atiende el WhatsApp?"** | *"El bot responde las 24 horas consultas frecuentes, calcula totales y deriva al vendedor humano con el pedido estructurado listo para cobrar."* |


---

<a id="capitulo-2"></a>

# CAPÍTULO 2: 02_CHECKLIST_Y_FRAMING_DEMO.MD

# Guión de Demo y Checklist Técnico — Reunión con Mikhail Murekian (Koala Cotillón / LP SRL)

Este documento es la guía paso a paso para liderar la presentación del prototipo y guiar la videollamada comercial sin traspiés técnicos ni falsas expectativas.

---

## 1. Framing de la Presentación (Regla de Oro)
> **Nunca decir**: *"Esto ya está conectado a tu sistema de gestión actual"*.  
> **Siempre decir**: *"Desarrollamos este prototipo funcional con la arquitectura real para que veas cómo interactúan el catálogo, la reserva de stock, el presupuestador y el agente de IA antes de acoplarlo a la base de datos definitiva de Koala"*.

---

## 2. Recorrido Paso a Paso de la Demo (15 a 20 minutos)

### Paso 1: Introducción y Diagnóstico del Dolor (3 min)
* Abrir la pantalla principal (`/`).
* Señalar el foco: *Koala hoy tiene gran variedad pero en internet no capitaliza las búsquedas locales*.
* Mostrar la selección entre **General Roca (Av. Roca 1350)** y **Neuquén Capital (Mitre 678)**. Notar cómo cambian los horarios de atención y el teléfono de contacto según la ciudad.

### Paso 2: El Catálogo y la Experiencia de Compra (5 min)
* Filtrar por categorías: **Polietileno & Embalaje** (destacando la fabricación propia de LP SRL), **Descartables**, **Cotillón**, etc.
* Mostrar la ficha de producto y la diferenciación automática entre **precio minorista** y **precio mayorista**.
* Agregar artículos al carrito / presupuestador.

### Paso 3: El Presupuestador y Derivación sin Fricción (4 min)
* Abrir el botón del carrito / Presupuestador.
* Mostrar la generación instantánea de **PDF oficial de cotización** (con membrete de Koala, validez, sucursal y desglose de IVA).
* Mostrar el botón de **"Confirmar pedido por WhatsApp"**: al presionarlo, arma el mensaje estructurado con los ítems y el número de cotización listo para que el cliente lo envíe al vendedor de Roca o Neuquén.

### Paso 4: El Módulo de Stock ERP y Reserva Atómica (5 min) — *El punto crítico de Mikhail*
* Acceder a la ruta `/admin` o presionar el botón de panel de control.
* Mostrar el **Monitor de Sincronización ERP**:
  * Pestaña de Inventario multi-sucursal.
  * Cómo se reflejan las alertas de stock crítico.
  * La simulación de **Reserva en Tiempo Real**: mostrar cómo el sistema evita vender una unidad si el stock cae a cero en la sucursal elegida, y cómo ofrece derivarlo o transferirlo desde la otra sucursal por la Ruta 22.
  * Importador de listas de precios CSV/Excel: demostrar cómo una empresa puede subir un archivo de Excel y actualizar 500 precios en 3 segundos.

### Paso 5: El Asistente de IA (3 min)
* Abrir el Drawer de IA lateral.
* Realizar una consulta de ejemplo: *"¿Qué opciones de bolsas tipo camiseta para comercio tienen y qué diferencia de precio hay por bulto cerrado?"*.
* Demostrar la velocidad y precisión del asesoramiento contextualizado a los productos de Koala.

---

## 3. Checklist Técnico de Verificación Pre-Demo

* [x] **Direcciones unificadas**: Av. Roca 1350 (General Roca) y Mitre 678 (Neuquén Capital).
* [x] **Teléfonos y WhatsApp verificados**:
  * Roca: `+54 298 453-6376` (`(0298) 443-6639`)
  * Neuquén: `+54 299 509-3911` (`(0299) 443-3960`)
* [x] **Metadatos y nombre del paquete**: `koala-lo-tiene` en `package.json` y `metadata.json`.
* [x] **Generador de PDF de cotización**: Librería jsPDF operativa y testeada.
* [x] **Compilación y Linteo**: 100% libre de errores sintácticos (`tsc --noEmit` y `vite build` aprobados).
* [ ] **Clave de Gemini API**: Confirmar que esté configurada en el entorno donde se ejecute la demo para que el Drawer de IA responda sin demoras.


---

