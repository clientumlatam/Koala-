import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
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
app.get(["/api/stores", "/stores"], (_req, res) => {
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

app.get(["/api/health", "/health"], (_req, res) => {
  res.json({
    status: "ok",
    app: "Koala Lo Tiene",
    timestamp: new Date().toISOString(),
    serviceWorkerReady: true,
    version: "2.1.0"
  });
});

app.get(["/api/erp/inventory-status", "/erp/inventory-status"], (_req, res) => {
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

app.post(["/api/erp/inventory-sync", "/erp/inventory-sync"], (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "Formato inválido. 'items' debe ser un array de artículos." });
    return;
  }
  res.json({
    success: true,
    processedCount: items.length,
    timestamp: new Date().toISOString(),
    message: `Sincronización procesada correctamente: ${items.length} artículos actualizados.`
  });
});

app.post(["/api/erp/orders", "/erp/orders"], (req, res) => {
  const { orderId } = req.body;
  res.json({
    success: true,
    orderId: orderId || `COT-${Date.now().toString().slice(-6)}`,
    erpStatus: "INGRESADO_COMO_PRESUPUESTO",
    timestamp: new Date().toISOString()
  });
});

app.post(["/api/ai/assistant", "/ai/assistant"], async (req, res) => {
  try {
    const { message, branch, context } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "El mensaje es requerido" });
      return;
    }
    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        reply: `¡Hola! Soy el asistente virtual de Koala Lo Tiene. ${
          branch === "neuquen" ? "En Sucursal Neuquén (Mitre 678)" : "En Casa Central General Roca (Av. Roca 1350)"
        } contamos con stock completo de polietileno directo de fábrica, descartables gastronómicos, cotillón, repostería, envases PET y librería.`,
        suggestedProducts: [],
      });
      return;
    }
    const systemInstruction = `Sos el asesor experto de ventas de "Koala Lo Tiene", la tienda líder en General Roca (Av. Roca 1350) y Neuquén (Mitre 678) especializada en fabricación de polietileno, descartables y cotillón. Respondé cordial y claramente en español rioplatense.`;
    const promptText = context ? `Contexto: ${JSON.stringify(context)}\nConsulta: ${message}` : message;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: { systemInstruction, temperature: 0.7 },
    });
    res.json({ reply: response.text || "¡Hola! Estoy listo para ayudarte." });
  } catch (error: any) {
    res.status(500).json({ error: "Ocurrió un error al procesar la consulta." });
  }
});

// Export Express app for Vercel
export default app;
