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
