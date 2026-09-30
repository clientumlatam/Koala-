import * as XLSX from 'xlsx';
import * as path from 'path';

const wb = XLSX.utils.book_new();

// ----------------------------------------------------
// HOJA 1: Registros DNS (21 filas con los 17 cambios y los registros que no requieren cambio)
// ----------------------------------------------------
const dnsRows = [
  {
    "#": 1,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "@",
    "Contenido": "172.67.172.156",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 2,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "@",
    "Contenido": "104.21.71.250",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 3,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "@",
    "Contenido": "2606:4700:3035::ac43:ac9c",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 4,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "@",
    "Contenido": "2606:4700:3037::6815:47fa",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 5,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "www",
    "Contenido": "172.67.172.156",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 6,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "www",
    "Contenido": "104.21.71.250",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 7,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "www",
    "Contenido": "2606:4700:3035::ac43:ac9c",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 8,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "www",
    "Contenido": "2606:4700:3037::6815:47fa",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare del sitio anterior"
  },
  {
    "#": 9,
    "Acción": "Agregar",
    "Tipo": "CNAME",
    "Nombre": "@",
    "Contenido": "16bc395e55b20519.vercel-dns-017.com",
    "Proxy": "DNS only",
    "Estado": "Pendiente",
    "Notas": "Valor que muestra Vercel para la raíz. Cloudflare lo aplana (CNAME flattening)."
  },
  {
    "#": 10,
    "Acción": "Agregar",
    "Tipo": "CNAME",
    "Nombre": "www",
    "Contenido": "16bc395e55b20519.vercel-dns-017.com",
    "Proxy": "DNS only",
    "Estado": "Pendiente",
    "Notas": "Vercel solo mostró el valor de @. Si para www muestra otro, usar ese."
  },
  {
    "#": 11,
    "Acción": "Editar",
    "Tipo": "CNAME",
    "Nombre": "mail",
    "Contenido": "icxn-lp.dvrdns.org",
    "Proxy": "DNS only",
    "Estado": "Pendiente",
    "Notas": "Hoy está proxied: pasar a DNS only. Obligatorio antes de cambiar nameservers."
  },
  {
    "#": 12,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "webmail",
    "Contenido": "172.67.172.156",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare, no es un servidor de correo"
  },
  {
    "#": 13,
    "Acción": "Borrar",
    "Tipo": "A",
    "Nombre": "webmail",
    "Contenido": "104.21.71.250",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare, no es un servidor de correo"
  },
  {
    "#": 14,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "webmail",
    "Contenido": "2606:4700:3035::ac43:ac9c",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare, no es un servidor de correo"
  },
  {
    "#": 15,
    "Acción": "Borrar",
    "Tipo": "AAAA",
    "Nombre": "webmail",
    "Contenido": "2606:4700:3037::6815:47fa",
    "Proxy": "Proxied",
    "Estado": "Pendiente",
    "Notas": "IP de Cloudflare, no es un servidor de correo"
  },
  {
    "#": 16,
    "Acción": "Agregar",
    "Tipo": "CNAME",
    "Nombre": "webmail",
    "Contenido": "icxn-lp.dvrdns.org",
    "Proxy": "DNS only",
    "Estado": "Pendiente",
    "Notas": "SUPUESTO: mismo destino que mail. Confirmar con ICXN antes de cargar."
  },
  {
    "#": 17,
    "Acción": "Dejar",
    "Tipo": "MX",
    "Nombre": "@",
    "Contenido": "10 mail.koalalotiene.com.ar",
    "Proxy": "DNS only",
    "Estado": "No requiere",
    "Notas": "Sin cambios"
  },
  {
    "#": 18,
    "Acción": "Dejar",
    "Tipo": "TXT",
    "Nombre": "@",
    "Contenido": "v=spf1 include:outbound.mailhop.org -all",
    "Proxy": "DNS only",
    "Estado": "No requiere",
    "Notas": "SPF, sin cambios"
  },
  {
    "#": 19,
    "Acción": "Dejar",
    "Tipo": "TXT",
    "Nombre": "_dmarc",
    "Contenido": "v=DMARC1; p=none; rua=mailto:soporte@icxn.com.ar; ruf=mailto:soporte@icxn.com.ar; rf=afrf; pct=100",
    "Proxy": "DNS only",
    "Estado": "No requiere",
    "Notas": "DMARC, sin cambios"
  },
  {
    "#": 20,
    "Acción": "Dejar",
    "Tipo": "TXT",
    "Nombre": "@",
    "Contenido": "google-site-verification=RDqYHFnW-GbqJAiqUU4novzlTDH46JOl1y-4uumq-8o",
    "Proxy": "DNS only",
    "Estado": "No requiere",
    "Notas": "Verificación de Google, sin cambios"
  },
  {
    "#": 21,
    "Acción": "Pedir a ICXN",
    "Tipo": "TXT",
    "Nombre": "(selector)._domainkey",
    "Contenido": "Selector y valor a confirmar con ICXN",
    "Proxy": "DNS only",
    "Estado": "Pendiente",
    "Notas": "No aparece DKIM en el export. Sin DKIM los mails pueden caer en spam."
  }
];

const wsDns = XLSX.utils.json_to_sheet(dnsRows);
wsDns['!cols'] = [
  { wch: 5 },  // #
  { wch: 14 }, // Acción
  { wch: 8 },  // Tipo
  { wch: 12 }, // Nombre
  { wch: 45 }, // Contenido
  { wch: 12 }, // Proxy
  { wch: 14 }, // Estado
  { wch: 60 }  // Notas
];
XLSX.utils.book_append_sheet(wb, wsDns, "Registros DNS");

// ----------------------------------------------------
// HOJA 2: Pasos (9 pasos cronológicos + Nameservers y advertencias)
// ----------------------------------------------------
const pasosRows = [
  {
    "#": 1,
    "Paso": "Cargar y corregir los registros",
    "Dónde": "Cloudflare",
    "Detalle": "Ver hoja 'Registros DNS'. Dejar mail y webmail en DNS only.",
    "Estado": "Pendiente"
  },
  {
    "#": 2,
    "Paso": "Consultar a ICXN",
    "Dónde": "soporte@icxn.com.ar",
    "Detalle": "Destino de webmail y mail, registro DKIM, otros registros necesarios. Ver hoja 'Consulta ICXN'.",
    "Estado": "Pendiente"
  },
  {
    "#": 3,
    "Paso": "Completar webmail y DKIM",
    "Dónde": "Cloudflare",
    "Detalle": "Con la respuesta de ICXN.",
    "Estado": "Pendiente"
  },
  {
    "#": 4,
    "Paso": "Presionar 'Continue to activation'",
    "Dónde": "Cloudflare",
    "Detalle": "Después de revisar la tabla de registros.",
    "Estado": "Pendiente"
  },
  {
    "#": 5,
    "Paso": "Eliminar registro DS si existe (DNSSEC)",
    "Dónde": "NIC Argentina",
    "Detalle": "Hacerlo antes de guardar los nameservers; si queda puede dejar el dominio sin resolver.",
    "Estado": "Pendiente"
  },
  {
    "#": 6,
    "Paso": "Reemplazar nameservers",
    "Dónde": "NIC Argentina",
    "Detalle": "Sacar nelly.ns.cloudflare.com y zac.ns.cloudflare.com. Poner braelyn.ns.cloudflare.com y bryce.ns.cloudflare.com.",
    "Estado": "Pendiente"
  },
  {
    "#": 7,
    "Paso": "Verificar activación",
    "Dónde": "Cloudflare",
    "Detalle": "'Check nameservers'. Puede tardar de minutos a unas horas.",
    "Estado": "Pendiente"
  },
  {
    "#": 8,
    "Paso": "Refrescar dominios",
    "Dónde": "Vercel",
    "Detalle": "'Refresh' para koalalotiene.com.ar y www. Ambos deben quedar en Valid Configuration.",
    "Estado": "Pendiente"
  },
  {
    "#": 9,
    "Paso": "Probar correo y webmail",
    "Dónde": "Casilla del dominio",
    "Detalle": "Mail de prueba desde y hacia el dominio; abrir webmail.",
    "Estado": "Pendiente"
  },
  { "#": "", "Paso": "", "Dónde": "", "Detalle": "", "Estado": "" },
  { "#": "", "Paso": "--- NAMESERVERS ---", "Dónde": "SITUACIÓN", "Detalle": "SERVIDOR", "Estado": "" },
  { "#": "", "Paso": "Quitar (actuales en NIC)", "Dónde": "NIC Argentina", "Detalle": "nelly.ns.cloudflare.com", "Estado": "A borrar" },
  { "#": "", "Paso": "Quitar (actuales en NIC)", "Dónde": "NIC Argentina", "Detalle": "zac.ns.cloudflare.com", "Estado": "A borrar" },
  { "#": "", "Paso": "Poner (asignados a tu zona)", "Dónde": "NIC Argentina", "Detalle": "braelyn.ns.cloudflare.com", "Estado": "A cargar" },
  { "#": "", "Paso": "Poner (asignados a tu zona)", "Dónde": "NIC Argentina", "Detalle": "bryce.ns.cloudflare.com", "Estado": "A cargar" }
];

const wsPasos = XLSX.utils.json_to_sheet(pasosRows);
wsPasos['!cols'] = [
  { wch: 5 },  // #
  { wch: 35 }, // Paso
  { wch: 25 }, // Dónde
  { wch: 65 }, // Detalle
  { wch: 15 }  // Estado
];
XLSX.utils.book_append_sheet(wb, wsPasos, "Pasos");

// ----------------------------------------------------
// HOJA 3: Consulta ICXN
// ----------------------------------------------------
const icxnRows = [
  {
    "#": 1,
    "Qué confirmar": "Destino correcto de webmail",
    "Por qué": "Las IPs actuales son de Cloudflare (proxy); el destino real quedó oculto.",
    "Respuesta de ICXN": ""
  },
  {
    "#": 2,
    "Qué confirmar": "Destino correcto de mail",
    "Por qué": "Hoy apunta a icxn-lp.dvrdns.org; confirmar que sigue vigente.",
    "Respuesta de ICXN": ""
  },
  {
    "#": 3,
    "Qué confirmar": "Registro DKIM (selector y valor TXT)",
    "Por qué": "No aparece en el export. Sin DKIM los mails pueden caer en spam.",
    "Respuesta de ICXN": ""
  },
  {
    "#": 4,
    "Qué confirmar": "Otros registros necesarios para el correo",
    "Por qué": "Por si hay registros que el escaneo no detectó.",
    "Respuesta de ICXN": ""
  },
  { "#": "", "Qué confirmar": "", "Por qué": "", "Respuesta de ICXN": "" },
  {
    "#": "MSG",
    "Qué confirmar": "Mensaje para enviar a soporte@icxn.com.ar",
    "Por qué": "Plantilla oficial lista para enviar",
    "Respuesta de ICXN": "Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar: 1) el destino correcto para webmail y mail, 2) el registro DKIM (selector y valor TXT), y 3) si hay algún otro registro necesario para el correo del dominio. Gracias."
  }
];

const wsIcxn = XLSX.utils.json_to_sheet(icxnRows);
wsIcxn['!cols'] = [
  { wch: 6 },
  { wch: 40 },
  { wch: 55 },
  { wch: 45 }
];
XLSX.utils.book_append_sheet(wb, wsIcxn, "Consulta ICXN");

// Save to both names so both are available
const out1 = path.resolve('public/koala-dns-checklist.xlsx');
const out2 = path.resolve('public/koalalotiene_dns_migracion_cloudflare.xlsx');

XLSX.writeFile(wb, out1);
XLSX.writeFile(wb, out2);

console.log('Successfully written:', out1);
console.log('Successfully written:', out2);
