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
