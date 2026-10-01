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
