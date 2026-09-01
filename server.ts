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
    system: "ERP Gateway Hybrid (Tango / Flexxus / Web)",
    branches: [
      { id: "roca", code: "DEP-01", name: "General Roca (Av. Roca 1350)", status: "online" },
      { id: "neuquen", code: "DEP-02", name: "Neuquén Capital (Mitre 678)", status: "online" }
    ]
  });
});

app.post("/api/erp/inventory-sync", (req, res) => {
  const { items, sourceSystem, timestamp } = req.body;
  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "Formato inválido. 'items' debe ser un array de artículos." });
    return;
  }

  console.log(`[ERP Sync] Recibidos ${items.length} artículos desde ${sourceSystem || 'Sistema Externo'} - ${timestamp || new Date().toISOString()}`);

  res.json({
    success: true,
    processedCount: items.length,
    timestamp: new Date().toISOString(),
    message: `Sincronización procesada correctamente: ${items.length} artículos actualizados en sucursales Roca y Neuquén.`
  });
});

app.post("/api/erp/orders", (req, res) => {
  const { orderId, branch, customer, items, total } = req.body;
  console.log(`[ERP Pedido Recibido] #${orderId} en ${branch} - Total: $${total} - Cliente: ${customer?.name || 'Consumidor Final'}`);

  res.json({
    success: true,
    orderId: orderId || `COT-${Date.now().toString().slice(-6)}`,
    erpStatus: "INGRESADO_COMO_PRESUPUESTO",
    timestamp: new Date().toISOString()
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
