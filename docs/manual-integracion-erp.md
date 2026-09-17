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
