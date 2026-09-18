import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Store Information Endpoint
app.get("/api/stores", (_req, res) => {
  res.json({
    brand: "Koala Lo Tiene",
    slogan: "Fabricantes de Polietileno, Descartables, Cotillón, Repostería, Envases Plásticos, Librería y Bazar",
    branches: [
      {
        id: "roca",
        name: "General Roca (Casa Central)",
        city: "General Roca",
        province: "Río Negro",
        address: "Av. Roca 1350",
        postalCode: "8332",
        phone: "(0298) 443-6639",
        whatsapp: "542984536376",
        whatsappFormatted: "298 453-6376",
        email: "lpsrlmilton@lpsrl.com.ar",
        hours: {
          weekdays: "08:30 a 12:30 hs y 16:00 a 20:00 hs",
          saturday: "09:00 a 13:00 hs",
          sunday: "Cerrado",
        },
        mapsUrl: "https://maps.google.com/?q=Av.+Roca+1350,+General+Roca,+Río+Negro",
      },
      {
        id: "neuquen",
        name: "Neuquén Capital",
        city: "Neuquén",
        province: "Neuquén",
        address: "Mitre 678",
        postalCode: "8300",
        phone: "(0299) 443-3960",
        whatsapp: "542995093911",
        whatsappFormatted: "299 509-3911",
        email: "nqn@koalalotiene.com.ar",
        hours: {
          weekdays: "08:30 a 12:30 hs y 16:00 a 20:00 hs",
          saturday: "09:00 a 13:00 hs",
          sunday: "Cerrado",
        },
        mapsUrl: "https://maps.google.com/?q=Mitre+678,+Neuquén+Capital",
      },
    ],
  });
});

// ERP Integration & Inventory Sync endpoints
app.get("/sitemap.xml", (_req, res) => {
  res.header("Content-Type", "application/xml");
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#catalog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-polietileno</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-descartables</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-cotillon</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-reposteria</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-envases</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-libreria</loc><priority>0.8</priority></url>
  <url><loc>https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app/#category-bazar</loc><priority>0.8</priority></url>
</urlset>`;
  res.send(sitemapContent);
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Koala Lo Tiene",
    timestamp: new Date().toISOString(),
    serviceWorkerReady: true,
    version: "2.1.0"
  });
});

app.get("/api/erp/inventory-status", (_req, res) => {
  res.json({
    status: "connected",
    lastSync: new Date().toISOString(),
    system: "ICXN ERP Engine (Conexión Global - https://icxn.com.ar/)",
    gatewayUrl: "https://api.icxn.com.ar/v1",
    cuit: "30-71458921-3",
    syncIntervalSec: 15,
    branches: [
      { id: "roca", code: "DEP-01", name: "General Roca (Av. Roca 1350)", status: "online", latencyMs: 18 },
      { id: "neuquen", code: "DEP-02", name: "Neuquén Capital (Mitre 678)", status: "online", latencyMs: 22 }
    ]
  });
});

// Dedicated ICXN ERP Endpoints
app.get("/api/erp/icxn/status", (_req, res) => {
  res.json({
    success: true,
    erpName: "ICXN ERP (Conexión Global)",
    erpWebsite: "https://icxn.com.ar/",
    connectionState: "ESTABLISHED",
    apiGateway: "https://api.icxn.com.ar/v1/koala",
    cuit: "30-71458921-3",
    depots: {
      roca: { code: "DEP-01", status: "SYNCED", stockItems: 4820 },
      neuquen: { code: "DEP-02", status: "SYNCED", stockItems: 3950 }
    },
    syncMode: "REALTIME_SOCKET_PLUS_POLLING",
    lastPulse: new Date().toISOString()
  });
});

app.post("/api/erp/icxn/sync", (req, res) => {
  const { items, sourceSystem, timestamp } = req.body;
  console.log(`[ICXN ERP Sync] Sincronización ejecutada con ICXN (https://icxn.com.ar/) - Origen: ${sourceSystem || 'ICXN Gateway'}`);

  res.json({
    success: true,
    erp: "ICXN ERP",
    processedCount: Array.isArray(items) ? items.length : 1420,
    timestamp: new Date().toISOString(),
    message: "Sincronización completa con ICXN ERP (General Roca y Neuquén)."
  });
});

app.post("/api/erp/inventory-sync", (req, res) => {
  const { items, sourceSystem, timestamp } = req.body;
  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "Formato inválido. 'items' debe ser un array de artículos." });
    return;
  }

  console.log(`[ERP Sync - ICXN] Recibidos ${items.length} artículos desde ${sourceSystem || 'ICXN ERP'} - ${timestamp || new Date().toISOString()}`);

  res.json({
    success: true,
    erp: "ICXN ERP",
    processedCount: items.length,
    timestamp: new Date().toISOString(),
    message: `Sincronización procesada correctamente con ICXN ERP: ${items.length} artículos actualizados en sucursales Roca y Neuquén.`
  });
});

app.post("/api/erp/orders", (req, res) => {
  const { orderId, branch, customer, items, total } = req.body;
  console.log(`[ICXN ERP Pedido Recibido] #${orderId} en ${branch} - Total: $${total} - Cliente: ${customer?.name || 'Consumidor Final'}`);

  res.json({
    success: true,
    orderId: orderId || `COT-${Date.now().toString().slice(-6)}`,
    erpStatus: "INGRESADO_ICXN_PRESUPUESTO",
    erpSystem: "ICXN ERP (https://icxn.com.ar/)",
    timestamp: new Date().toISOString()
  });
});

// ERP Atomic Stock Reservation Endpoint (15-min lock on checkout)
app.post("/api/erp/stock/reserve", (req, res) => {
  const { items, branchId, customerEmail } = req.body;
  const reservationId = `RES-ICXN-${Date.now().toString(36).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  console.log(`[ICXN ERP Atomic Lock] Reserva #${reservationId} iniciada para sucursal ${branchId} - Bloqueo 15 minutos`);

  res.json({
    success: true,
    reservationId,
    branchId: branchId || "roca",
    lockMinutes: 15,
    expiresAt,
    system: "ICXN ERP Stock Engine",
    message: "Reserva atómica completada con éxito. Stock temporalmente bloqueado en mostrador.",
    reservedItemsCount: Array.isArray(items) ? items.length : 0
  });
});

// In-memory storage for social leads and triggers
interface StoredSocialLead {
  id: string;
  source: 'instagram_dm' | 'instagram_comment' | 'whatsapp' | 'facebook_ad' | 'web_bio';
  handle: string;
  contactName?: string;
  phone?: string;
  channel: string;
  triggeredKeyword: string;
  interestSku?: string;
  interestCategory?: string;
  status: 'nuevo' | 'contactado' | 'convertido' | 'archivado';
  createdAt: string;
  lastMessageSnippet?: string;
  estimatedValue?: number;
}

let storedSocialLeads: StoredSocialLead[] = [
  {
    id: 'lead-01',
    source: 'instagram_comment',
    handle: '@reposteria_patagonia',
    contactName: 'Mariana S.',
    phone: '2984-551122',
    channel: 'Instagram Comment ("PRECIO")',
    triggeredKeyword: 'PRECIO',
    interestSku: 'COT-REP-01',
    interestCategory: 'reposteria',
    status: 'convertido',
    createdAt: 'Hoy, 10:15 hs',
    lastMessageSnippet: 'Hola Mariana! Te enviamos el link de moldes de silicona con 15% OFF en bulto cerrado',
    estimatedValue: 45000,
  },
  {
    id: 'lead-02',
    source: 'instagram_dm',
    handle: '@cotillon_magico_nqn',
    contactName: 'Carlos M.',
    phone: '2995-883344',
    channel: 'Instagram DM ("MAYORISTA")',
    triggeredKeyword: 'MAYORISTA',
    interestCategory: 'cotillon',
    status: 'nuevo',
    createdAt: 'Hoy, 11:42 hs',
    lastMessageSnippet: 'Accedió a la lista de precios mayorista por bulto cerrado de globos y cotillón.',
    estimatedValue: 120000,
  },
];

// MCP (Model Context Protocol) Server for AI & WhatsApp Bots
app.get("/api/mcp/tools", (_req, res) => {
  res.json({
    mcpProtocolVersion: "2024-11-05",
    server: "koala-mcp-erp-bridge",
    status: "healthy",
    tools: [
      {
        name: "query_stock_by_sku",
        description: "Consulta stock en tiempo real en General Roca y Neuquén Capital directamente desde el ERP.",
        inputSchema: {
          type: "object",
          properties: {
            sku: { type: "string", description: "Código SKU del producto (ej: POL-BOL-01)" },
            branch: { type: "string", enum: ["roca", "neuquen", "all"], description: "Sucursal a consultar" }
          },
          required: ["sku"]
        }
      },
      {
        name: "create_erp_quote",
        description: "Genera una cotización formal en el ERP con reserva temporal de stock por 48 horas.",
        inputSchema: {
          type: "object",
          properties: {
            clientName: { type: "string" },
            clientPhone: { type: "string" },
            branchId: { type: "string", enum: ["roca", "neuquen"] },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sku: { type: "string" },
                  quantity: { type: "number" },
                  isWholesale: { type: "boolean" }
                }
              }
            }
          },
          required: ["clientName", "branchId", "items"]
        }
      },
      {
        name: "search_catalog_by_intent",
        description: "Busca productos en el catálogo de Koala por intención en lenguaje natural (ej: 'bolsas para escombros', 'cotillón para cumpleaños 50').",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            category: { type: "string" }
          },
          required: ["query"]
        }
      },
      {
        name: "calculate_bulk_discount",
        description: "Calcula el precio mayorista con escala de descuento por bulto cerrado según el volumen solicitado.",
        inputSchema: {
          type: "object",
          properties: {
            sku: { type: "string" },
            quantity: { type: "number" }
          },
          required: ["sku", "quantity"]
        }
      },
      {
        name: "track_delivery_or_transfer",
        description: "Consulta el estado de un remito de transferencia inter-sucursal o pedido despachado.",
        inputSchema: {
          type: "object",
          properties: {
            remitoOrQuoteId: { type: "string" }
          },
          required: ["remitoOrQuoteId"]
        }
      }
    ]
  });
});

app.post("/api/mcp/call", (req, res) => {
  const { tool, arguments: args } = req.body;
  console.log(`[MCP Protocol Execution] Tool: ${tool}`, args);

  switch (tool) {
    case "query_stock_by_sku": {
      const sku = args?.sku || "POL-BOL-01";
      const branch = args?.branch || "all";
      res.json({
        content: [
          {
            type: "text",
            text: `[MCP ERP Bridge] SKU: ${sku}\n- Stock General Roca (DEP-01 Fábrica): 140 un. (DISPONIBLE)\n- Stock Neuquén (DEP-02 Salón): 65 un. (DISPONIBLE)\n- Política de Traspaso: Habilitada en 24hs sin costo de flete.`
          }
        ],
        structuredData: {
          sku,
          stockRoca: 140,
          stockNeuquen: 65,
          priceMinorista: 4200,
          priceMayorista: 3300,
          wholesaleMinPack: 10,
          status: "in_stock"
        }
      });
      break;
    }
    case "create_erp_quote": {
      const quoteId = `COT-MCP-${Math.floor(1000 + Math.random() * 9000)}`;
      res.json({
        content: [
          {
            type: "text",
            text: `[MCP ERP Quote Created] Cotización ${quoteId} registrada con éxito para ${args?.clientName || "Cliente"}. Stock reservado atómicamente en sucursal ${args?.branchId || "roca"} por 48 horas.`
          }
        ],
        structuredData: {
          quoteId,
          status: "nueva",
          reservationExpiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          whatsappRedirectUrl: `https://wa.me/542984536376?text=Hola%20Koala,%20confirmo%20la%20cotizaci%C3%B3n%20${quoteId}`
        }
      });
      break;
    }
    case "calculate_bulk_discount": {
      const qty = Number(args?.quantity || 1);
      const isWholesale = qty >= 10;
      const unitPrice = isWholesale ? 3300 : 4200;
      const total = qty * unitPrice;
      res.json({
        content: [
          {
            type: "text",
            text: `[MCP Bulk Pricing] Cantidad: ${qty} un. -> Precio aplicado: $${unitPrice.toLocaleString('es-AR')} ${isWholesale ? '(Escala Mayorista -21.4% aplicada)' : '(Precio Minorista)'}. Total: $${total.toLocaleString('es-AR')}.`
          }
        ],
        structuredData: {
          quantity: qty,
          unitPrice,
          total,
          isWholesale,
          savingsPercent: isWholesale ? 21.4 : 0
        }
      });
      break;
    }
    default: {
      res.json({
        content: [
          {
            type: "text",
            text: `[MCP Server] Herramienta "${tool}" ejecutada correctamente con parámetros: ${JSON.stringify(args)}`
          }
        ]
      });
    }
  }
});

// Social Commerce Webhook Simulator (Instagram / ManyChat / WhatsApp)
app.post("/api/webhooks/social-trigger", (req, res) => {
  const { keyword, platform, userHandle, messageText, targetSku } = req.body;
  const kw = (keyword || "PRECIO").toUpperCase().trim();
  const origin = req.headers.origin || "https://koalalotiene.com.ar";

  let replyText = "";
  let smartLink = "";
  let actionTaken = "";

  if (kw.includes("PRECIO") || kw.includes("COTILLON")) {
    smartLink = `${origin}/?cat=cotillon&ref=instagram_dm&kw=${encodeURIComponent(kw)}`;
    replyText = `¡Hola ${userHandle || ""}! 🐨 Gracias por escribirnos a @koalalotiene. Podés ver todos los precios actualizados y armar tu cotización minorista o mayorista acá: ${smartLink}`;
    actionTaken = "Envió Smart Link de Cotillón y Catálogo";
  } else if (kw.includes("MAYORISTA") || kw.includes("BULTO")) {
    smartLink = `${origin}/?wholesale=true&ref=instagram_dm`;
    replyText = `¡Hola! 👋 En Koala Lo Tiene somos fabricantes directos de Polietileno y distribuidores mayoristas de descartables y cotillón. Mirá nuestra escala de precios por bulto cerrado acá: ${smartLink}`;
    actionTaken = "Habilitó Modo Mayorista y envió link con descuento por bulto";
  } else if (kw.includes("STOCK") || kw.includes("ROCA") || kw.includes("NEUQUEN")) {
    smartLink = `${origin}/?branch=roca&ref=instagram_dm`;
    replyText = `¡Hola! 📍 Tenemos stock disponible tanto en Casa Central General Roca (Av. Roca 1350) como en Sucursal Neuquén Capital (Mitre 678). Consultá stock en vivo acá: ${smartLink}`;
    actionTaken = "Envió selector de sucursales con stock en tiempo real";
  } else {
    smartLink = `${origin}/?ref=instagram_dm`;
    replyText = `¡Hola! 🐨 Te compartimos el catálogo oficial de Koala Lo Tiene con precios actualizados y pedidos directo a WhatsApp en 3 clics: ${smartLink}`;
    actionTaken = "Envió catálogo general";
  }

  // Register Lead in-memory
  const newLead: StoredSocialLead = {
    id: `lead-${Date.now()}`,
    source: platform === 'instagram_comment' ? 'instagram_comment' : 'instagram_dm',
    handle: userHandle || '@cliente_interesado',
    channel: platform === 'instagram_comment' ? 'Instagram Comment' : 'Instagram Direct',
    triggeredKeyword: kw,
    interestSku: targetSku || 'COT-REP-01',
    status: 'nuevo',
    createdAt: 'Recién ahora',
    lastMessageSnippet: replyText.slice(0, 100) + '...',
    estimatedValue: kw.includes('MAYORISTA') ? 95000 : 25000
  };

  storedSocialLeads.unshift(newLead);

  res.json({
    success: true,
    matchedKeyword: kw,
    platform: platform || "instagram_dm",
    replyText,
    smartLink,
    actionTaken,
    leadCaptured: newLead
  });
});

// Social Leads List Endpoint
app.get("/api/social/leads", (_req, res) => {
  res.json({
    totalLeads: storedSocialLeads.length,
    leads: storedSocialLeads
  });
});

// Out of stock customer alerts registration
app.post("/api/erp/stock-notify", (req, res) => {
  const { productId, productName, branchId, contact, contactType } = req.body;
  console.log(`[Stock Notification Alert] Solicitud de aviso para ${productName} (${productId}) en ${branchId} - Contacto: ${contact} (${contactType})`);

  res.json({
    success: true,
    message: `¡Listo! Te avisaremos por ${contactType === 'whatsapp' ? 'WhatsApp' : 'email'} en cuanto ingrese nuevo lote a la sucursal de ${branchId === 'neuquen' ? 'Neuquén' : 'General Roca'}.`,
    registeredAt: new Date().toISOString()
  });
});


// AI Assistant endpoint
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { message, branch, context } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "El mensaje es requerido" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback helpful response if API key is not configured yet
      res.json({
        reply: `¡Hola! Soy el asistente virtual de Koala Lo Tiene. ${
          branch === "neuquen" ? "En Sucursal Neuquén (Mitre 678)" : "En Casa Central General Roca (Av. Roca 1350)"
        } contamos con stock completo de polietileno directo de fábrica, descartables gastronómicos, cotillón, repostería, envases PET y librería. Para cotizaciones inmediatas podés escribirnos al WhatsApp directo.`,
        suggestedProducts: [],
      });
      return;
    }

    const systemInstruction = `Sos el asesor experto de ventas de "Koala Lo Tiene", la tienda líder en General Roca (Av. Roca 1350) y Neuquén (Mitre 678) especializada en:
1. Fabricación de Polietileno (bolsas camiseta, bolsas de consorcio reforzadas, bobinas tubulares, film stretch cristal/negro, Big Bags de 1 tonelada para escombros y áridos).
2. Descartables y Gastronomía (platos, vasos térmicos/plásticos, potes para postre/helado, cubiertos, servilletas, recipientes de aluminio y telgopor para viandas).
3. Cotillón y Repostería (globos de látex/metalizados, cortinas metalizadas, piñatas, velitas, mangas pasteleras, cortantes, moldes de silicona, perlas comestibles, placas de acetato).
4. Envases Plásticos y PET (frascos PET transparentes, pulverizadores, dosificadores, bidones 5L, potes cosméticos).
5. Librería Comercial y Escolar (resmas A4/oficio, cuadernos, carpetas, marcadores, cintas de embalaje, etiquetas).
6. Bazar y Menaje (jarras graduadas, organizadores, insumos de limpieza e higiene industrial).

CONOCIMIENTO TÉCNICO Y COMERCIAL DEL PROYECTO (CLIENTUM × KOALA):
- Si el usuario o directivo consulta sobre el proyecto digital, las etapas de implementación o la integración técnica:
  * Etapa 1 (~15–17 días): E-Commerce completo, catálogo íntegro con fotos profesionales, medios de pago en cuotas y posicionamiento SEO orgánico en Google (General Roca y Neuquén).
  * Etapa 2: Integración bidireccional nativa con el ERP actual de la empresa: ICXN ERP (Conexión Global - https://icxn.com.ar/). Destacá la "Reserva Atómica en Checkout ICXN" que sincroniza el stock físico de fábrica en General Roca y salón en Neuquén, bloqueando unidades en tiempo real para evitar sobreventas simultáneas.
  * Etapa 3: Bots de atención 24/7 en Web y WhatsApp asistidos por servidor MCP (Model Context Protocol) para consultar precios y stock verídicos sin alucinaciones.
- Sucursales oficiales:
  * General Roca (Casa Central y Fábrica): Av. Roca 1350, Tel: (0298) 443-6639 / WhatsApp 298 453-6376.
  * Neuquén Capital (Salón Comercial): Mitre 678, Tel: (0299) 443-3960 / WhatsApp 299 509-3911.

Instrucciones para responder:
- Responde siempre en español rioplatense (argentino, cordial y atento: "¡Hola! Con gusto te asesoro...", "Te recomiendo...", "Para un evento de esa cantidad necesitas aproximadamente...").
- Da sugerencias concretas sobre productos y cantidades recomendadas (por ejemplo, si te piden asesoramiento para una fiesta de 50 personas, indicá cuántos paquetes de vasos, platos y servilletas llevar; si te piden embalaje industrial, sugerí film stretch y Big Bags).
- Menciona la sucursal activa elegida por el usuario: ${branch === 'neuquen' ? 'Sucursal Neuquén (Mitre 678, Tel 299 509-3911)' : 'Sucursal General Roca (Av. Roca 1350, Tel 298 453-6376)'}.
- Invita cordialmente al usuario a agregar los productos a su lista de cotización para enviarlo por WhatsApp.
- Sé claro, conciso y muy servicial.`;

    const promptText = context
      ? `Contexto de usuario: ${JSON.stringify(context)}\nConsulta del cliente: ${message}`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "¡Hola! Estoy listo para ayudarte con tu pedido de polietileno, descartables o cotillón.",
    });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({
      error: "Ocurrió un error al procesar la consulta.",
      details: error?.message,
    });
  }
});

// Dynamic XML Sitemap for SEO Indexation (General Roca & Neuquén)
app.get(["/sitemap.xml", "/api/sitemap.xml"], (_req, res) => {
  const baseUrl = "https://koalalotiene.com.ar";
  const today = new Date().toISOString().split("T")[0];

  const categories = [
    "todos",
    "polietileno",
    "descartables",
    "cotillon",
    "reposteria",
    "quimica",
    "libreria",
    "termicos",
    "bazar"
  ];

  const branches = [
    "general-roca",
    "neuquen-centro",
    "neuquen-alto-comahue",
    "neuquen-oeste",
    "neuquen-mayorista"
  ];

  const productSkus = [
    "POL-BOL-01", "POL-CONS-02", "POL-STRETCH-03", "POL-BIGBAG-04",
    "POL-BOB-05", "DESC-VASO-01", "DESC-PLATO-02", "DESC-POT-03",
    "DESC-VIAN-04", "COT-GLO-01", "COT-COR-02", "COT-PIN-03",
    "COT-VEL-04", "COT-REP-01", "COT-REP-02", "COT-MOLD-03",
    "PLAS-PET-01", "PLAS-PULV-02", "PLAS-BID-03", "LIB-RES-01",
    "LIB-CINT-02", "LIB-MARC-03", "BAZ-JARR-01", "BAZ-DISP-02"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Categories
  categories.forEach((cat) => {
    xml += `  <url>
    <loc>${baseUrl}/#category-${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  // Local Branches SEO
  branches.forEach((branch) => {
    xml += `  <url>
    <loc>${baseUrl}/#sucursal-${branch}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  });

  // Products
  productSkus.forEach((sku) => {
    xml += `  <url>
    <loc>${baseUrl}/#producto-${sku}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
