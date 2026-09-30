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
