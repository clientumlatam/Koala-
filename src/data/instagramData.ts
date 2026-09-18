import { InstagramPost } from '../types';

export const INSTAGRAM_PROFILE_INFO = {
  handle: 'koalalotiene',
  name: 'Koala Lo Tiene',
  bio: [
    '☆ De lunes a viernes de 8.30 a 12.30hs y de 16 a 20hs. ☆ Sábados de 9 a 13hs',
    '☆ 2984536376',
    '☆ Avenida Roca 1350, General Roca, Rio Negro 8332',
    'wa.link/ka1dfe'
  ],
  postsCount: 167,
  followersCount: 2263,
  followingCount: 13,
  avatarUrl: '/koala-logo.png',
  externalUrl: 'https://www.instagram.com/koalalotiene/',
  whatsappUrl: 'https://wa.me/542984536376?text=Hola%20Koala%20Lo%20Tiene!%20Vi%20su%20Instagram%20y%20quiero%20hacer%20una%20consulta',
  highlights: [
    { id: 'hl-1', title: 'Horarios', icon: 'Clock', description: 'Atención Roca y Neuquén' },
    { id: 'hl-2', title: 'Contacto', icon: 'MessageCircle', description: 'WhatsApp y Asesores' },
    { id: 'hl-3', title: 'Fábrica', icon: 'Factory', description: 'Polietileno y Extrusión' },
    { id: 'hl-4', title: 'Promos BPN', icon: 'CreditCard', description: '3 y 6 Cuotas Sin Interés' },
    { id: 'hl-5', title: 'Locales', icon: 'MapPin', description: 'Av. Roca 1350 & Mitre 678' },
    { id: 'hl-6', title: 'Catálogo', icon: 'ShoppingBag', description: 'Tienda en 3 Clics' }
  ]
};

export const INITIAL_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-post-01',
    type: 'carousel',
    title: '¡MEGA OFERTAS! FÁBRICA & DISTRIBUIDORA Koala Lo tiene!',
    category: 'ofertas',
    date: 'Hace 2 días',
    likes: 248,
    commentsCount: 39,
    mediaUrl: '/instagram/ig_mega_ofertas_intro.svg',
    isPinned: true,
    suggestedKeyword: 'PRECIO',
    permalink: 'https://www.instagram.com/p/koala-mega-ofertas/',
    caption: `🐨 ¡MEGA OFERTAS EN KOALA LO TIENE! FÁBRICA & DISTRIBUIDORA ALTO VALLE 🏭✨
Deslizá para ver las 4 promociones especiales de la semana 👉

📦 PANEL 1: Todo para tu comercio, emprendimiento y eventos en un solo lugar. Precios mayoristas directo de fábrica y minoristas en mostrador.
🛍️ PANEL 2: OFERTAS EN POLIETILENO Y EMBALAJE con ahorro de hasta 17%:
• Bolsas Camiseta Blanca 40x50 cm: de $3.400 a $2.900 (por bulto cerrado)
• Film Stretch Manual Virgen 50 cm: de $14.800 a $12.900
• Big Bags 1 Tonelada con boca de carga y fondo ciego.
🎈 PANEL 3: COTILLÓN, EVENTOS & REPOSTERÍA
• Globos látex y Chrome Reflex, cortinas shimmer lluvia, bengalas y vajilla descartable.
• 💳 ¡3 y 6 CUOTAS SIN INTERÉS con Tarjeta Confiable BPN!
• 💵 10% OFF pagando con transferencia bancaria directa.
📍 PANEL 4: VISITANOS O HACÉ TU PEDIDO:
• General Roca (Casa Central & Fábrica): Av. Roca 1350 • Tel: 298 453-6376
• Neuquén Capital (Salón Comercial): Mitre 678 • Tel: 299 509-3911
🚚 Envíos a todo el Alto Valle y distribución regional. ¡Sumá Puntos Club Koala!

👉 Comentá "PRECIO" o "STOCK" y te enviamos el catálogo completo al DM al instante!

#KoalaLoTiene #AltoValle #GeneralRoca #Neuquen #FabricaPolietileno #Cotillon #Descartables #BolsasDePolietileno #OfertasMayoristas`,
    carouselSlides: [
      {
        title: '¡MEGA OFERTAS! FÁBRICA & DISTRIBUIDORA',
        subtitle: 'Koala Lo tiene! • Alto Valle Fábrica & Distribuidora',
        badge: 'SUPER PROMO SEMANAL',
        bgColor: 'from-amber-600 via-orange-600 to-rose-600',
        imageUrl: '/instagram/ig_mega_ofertas_intro.svg',
        highlightOffer: 'Ahorro de hasta un 17% en bultos de fábrica',
        bulletPoints: [
          'Fabricación propia en General Roca (Av. Roca 1350)',
          'Salón comercial y distribución en Neuquén (Mitre 678)',
          'Envíos en el día a todo el Alto Valle de Río Negro y Neuquén',
          'Venta mayorista y minorista con stock en tiempo real'
        ]
      },
      {
        title: 'OFERTAS EN POLIETILENO Y EMBALAJE',
        subtitle: 'Ahorro de hasta el 17% en insumos industriales',
        badge: 'DIRECTO DE FÁBRICA',
        bgColor: 'from-blue-700 via-indigo-700 to-slate-900',
        imageUrl: '/instagram/ig_ofertas_polietileno_precios.svg',
        priceBadge: 'Bolsas Camiseta $2.900 / Film Stretch $12.900',
        bulletPoints: [
          'Bolsas Camiseta 40x50 cm: de $3.400 a $2.900 x paquete',
          'Film Stretch Manual 50cm virgen: de $14.800 a $12.900 bobina',
          'Big Bags 1 Tonelada con boca de carga y fondo ciego',
          'Bobinas de polietileno tubular y lámina para el agro y fruticultura'
        ]
      },
      {
        title: 'COTILLÓN, FINANCIACIÓN Y MÁS',
        subtitle: 'Todo para cumpleaños, fiestas infantiles y eventos',
        badge: '3 Y 6 CUOTAS BPN',
        bgColor: 'from-purple-700 via-pink-600 to-rose-600',
        imageUrl: '/instagram/ig_cotillon_financiacion_bpn.svg',
        priceBadge: '3 y 6 Cuotas Sin Interés BPN + 10% OFF Transf',
        bulletPoints: [
          'Globos Látex Chrome Reflex R12 en colores surtidos',
          'Cortinas Metalizadas Shimmer Lluvia Flecos 1x2 mts',
          'Vajilla descartable, platos dorados, vasos y servilletas',
          'Financiación en 3 y 6 cuotas con Tarjeta Confiable BPN'
        ]
      },
      {
        title: 'HACÉ TU PEDIDO POR WHATSAPP Y VISITANOS',
        subtitle: 'Atención personalizada en Roca y Neuquén Capital',
        badge: 'ENVÍOS REGIONALES',
        bgColor: 'from-emerald-700 via-teal-700 to-slate-900',
        imageUrl: '/instagram/ig_pedidos_whatsapp_visitanos.svg',
        priceBadge: '¡Sumá Puntos Club Koala con cada compra!',
        bulletPoints: [
          'Casa Central General Roca: Av. Roca 1350 (Tel: 298 453-6376)',
          'Neuquén Capital: Mitre 678 (Tel: 299 509-3911)',
          'Horarios: Lun a Vie 8:30 a 12:30 y 16:00 a 20:00 • Sáb 9:00 a 13:00',
          'Stock sincronizado entre ambas sucursales con entrega rápida'
        ]
      }
    ],
    taggedProductSkus: ['KOA-POL-100', 'KOA-POL-101', 'KOA-COT-114', 'KOA-COT-116']
  },
  {
    id: 'ig-post-02',
    type: 'image',
    title: 'VISITANOS O HACÉ TU PEDIDO - Roca & Neuquén',
    category: 'locales',
    date: 'Hace 3 días',
    likes: 312,
    commentsCount: 45,
    mediaUrl: '/instagram/ig_visitanos_mapa_locales.svg',
    suggestedKeyword: 'UBICACION',
    permalink: 'https://www.instagram.com/p/koala-visitanos-mapa/',
    caption: `📍🗺️ ¡VISITANOS O HACÉ TU PEDIDO DESDE CUALQUIER PUNTO DEL ALTO VALLE! 🐨💙

Te esperamos en nuestras dos sucursales oficiales con la mayor variedad en polietileno, embalaje, cotillón y descartables:

🏢 CASA CENTRAL GENERAL ROCA:
📍 Av. Roca 1350
📱 WhatsApp: 298 453-6376

🏢 SALÓN COMERCIAL NEUQUÉN CAPITAL:
📍 Mitre 678
📱 WhatsApp: 299 509-3911

✨ ¡Sumá Puntos Club Koala con cada compra y aprovechá 3 y 6 Cuotas Sin Interés con Tarjeta Confiable BPN!

👉 Escribí "UBICACION" para enviarte la ubicación directa en Google Maps.

#KoalaLoTiene #GeneralRoca #NeuquenCapital #AltoValle #RioNegro #LocalesComerciales #Polietileno #Cotillon`,
    taggedProductSkus: ['KOA-POL-100', 'KOA-COT-114']
  },
  {
    id: 'ig-post-03',
    type: 'image',
    title: 'MEGA OFERTAS! Koala Lo tiene! Todo para tu comercio y eventos',
    category: 'ofertas',
    date: 'Hace 4 días',
    likes: 278,
    commentsCount: 34,
    mediaUrl: '/instagram/ig_mega_ofertas_tienda_pasillo.svg',
    suggestedKeyword: 'PRECIO',
    permalink: 'https://www.instagram.com/p/koala-mega-ofertas-tienda/',
    caption: `🏭✨ ¡MEGA OFERTAS EN KOALA LO TIENE! FÁBRICA & DISTRIBUIDORA ALTO VALLE 🐨🎉

Todo lo que necesitás para tu comercio, emprendimiento y eventos en un solo lugar:
✅ Polietileno directo de fábrica (bobinas, láminas, bolsas camiseta y consorcio)
✅ Embalaje industrial (film stretch virgen, cintas adhesivas y big bags)
✅ Cotillón festivo, globos Chrome, bengalas y vajilla dorada descartable
✅ Descartables para gastronomía y repostería artesanal

📍 General Roca: Av. Roca 1350 • Tel: 298 453-6376
📍 Neuquén Capital: Mitre 678 • Tel: 299 509-3911

Comentá "PRECIO" y te mandamos la lista mayorista completa al instante!

#Ofertas #Comercio #Eventos #AltoValle #GeneralRoca #Neuquen #KoalaLoTiene`,
    taggedProductSkus: ['KOA-POL-100', 'KOA-POL-101', 'KOA-COT-114']
  },
  {
    id: 'ig-post-04',
    type: 'image',
    title: 'OFERTAS EN POLIETILENO Y EMBALAJE - ¡Ahorro hasta 17%!',
    category: 'polietileno',
    date: 'Hace 5 días',
    likes: 205,
    commentsCount: 29,
    mediaUrl: '/instagram/ig_polietileno_fabrica_casco.svg',
    suggestedKeyword: 'POLIETILENO',
    permalink: 'https://www.instagram.com/p/koala-polietileno-fabrica/',
    caption: `👷‍♂️📦 ¡OFERTAS EN POLIETILENO Y EMBALAJE DIRECTO DE FÁBRICA! 🐨🏭

Ahorrá hasta un 17% en tus compras mayoristas y minoristas con entrega inmediata en todo el Alto Valle:
🛍️ Bags & Bolsas Camiseta directo de fábrica
📜 Film Stretch Manual virgen de 50 cm
🏗️ Big Bags de 1 Tonelada con 4 asas reforzadas
🌾 Bobinas tubulares para agro e industria frutícola

Precios diferenciales por bulto cerrado. Escribí "POLIETILENO" para cotización personalizada!

#Polietileno #Embalaje #BigBags #FilmStretch #Fabrica #GeneralRoca #KoalaLoTiene`,
    taggedProductSkus: ['KOA-POL-100', 'KOA-POL-101', 'KOA-POL-106']
  },
  {
    id: 'ig-post-05',
    type: 'image',
    title: 'COTILLÓN & EVENTOS - Cuotas sin Interés con BPN Confiable',
    category: 'cotillon',
    date: 'Hace 6 días',
    likes: 240,
    commentsCount: 38,
    mediaUrl: '/instagram/ig_cotillon_eventos_fiesta_bpn.svg',
    suggestedKeyword: 'COTILLON',
    permalink: 'https://www.instagram.com/p/koala-cotillon-eventos-bpn/',
    caption: `🎈🎂 ¡COTILLÓN, REPOSTERÍA & EVENTOS CON BENEFICIOS EXCLUSIVOS BPN! 🐨✨

Prepará tus festejos y celebraciones con las mejores facilidades de pago:
💳 3 y 6 Cuotas Sin Interés con Tarjeta Confiable Banco Provincia del Neuquén (BPN)
💵 10% OFF adicional pagando con transferencia bancaria
⭐ Sumá Puntos Club Koala con cada compra

Encontrá globos látex y Chrome, vajilla descartable, moldes de silicona para repostería, velas y bengalas.

Escribí "COTILLON" en comentarios para recibir catálogo y promociones!

#Cotillon #Eventos #Reposteria #BPN #CuotasSinInteres #KoalaLoTiene #AltoValle`,
    taggedProductSkus: ['KOA-COT-114', 'KOA-COT-116', 'KOA-REP-121']
  },
  {
    id: 'ig-post-06',
    type: 'image',
    title: 'OFERTAS EN POLIETILENO: Bolsas Camiseta $2.900 / Film Stretch $12.900',
    category: 'polietileno',
    date: 'Hace 1 semana',
    likes: 195,
    commentsCount: 22,
    mediaUrl: '/instagram/ig_ofertas_polietileno_precios.svg',
    suggestedKeyword: 'PRECIO',
    permalink: 'https://www.instagram.com/p/koala-ofertas-polietileno-precios/',
    caption: `💰📉 ¡SUPER PRECIOS EN POLIETILENO Y EMBALAJE! 🐨📦

Aprovechá los descuentos de la semana:
• Bolsas Camiseta Minorista: de $3.400 a $2.900 (Ahorro $3.400 por bulto)
• Film Stretch Manual 50cm: de $14.800 a $12.900 (Ahorro $1.900)
• Big Bags industriales con entrega inmediata

Comentá "PRECIO" para hacer tu pedido con entrega en el día!

#Ofertas #Polietileno #BolsasCamiseta #FilmStretch #PreciosBajos #KoalaLoTiene`,
    taggedProductSkus: ['KOA-POL-100', 'KOA-POL-101']
  },
  {
    id: 'ig-post-07',
    type: 'image',
    title: 'COTILLÓN, FINANCIACIÓN Y MÁS - Cortinas Lluvia y Globos Metalizados',
    category: 'cotillon',
    date: 'Hace 1 semana',
    likes: 218,
    commentsCount: 26,
    mediaUrl: '/instagram/ig_cotillon_financiacion_bpn.svg',
    suggestedKeyword: 'FINANCIACION',
    permalink: 'https://www.instagram.com/p/koala-cotillon-financiacion-bpn/',
    caption: `🎉💳 ¡COTILLÓN, CORTINAS METALIZADAS Y FINANCIACIÓN SIN INTERÉS! 🐨✨

• Globos pasteles y metalizados surtidos
• Cortinas metalizadas shimmer lluvia: de $14.800 a $12.900 (Ahorro $5.400 en combo)
• 3 y 6 Cuotas Sin Interés con Tarjetas BPN Confiable

Visitá nuestros salones de General Roca y Neuquén Capital!

#Cotillon #Financiacion #BPN #Fiestas #Cumpleaños #KoalaLoTiene`,
    taggedProductSkus: ['KOA-COT-114', 'KOA-COT-116']
  },
  {
    id: 'ig-post-08',
    type: 'image',
    title: 'HACÉ TU PEDIDO POR WHATSAPP Y VISITANOS EN ROCA Y NEUQUÉN',
    category: 'locales',
    date: 'Hace 2 semanas',
    likes: 289,
    commentsCount: 42,
    mediaUrl: '/instagram/ig_pedidos_whatsapp_visitanos.svg',
    suggestedKeyword: 'WHATSAPP',
    permalink: 'https://www.instagram.com/p/koala-pedidos-whatsapp/',
    caption: `📱🐨 ¡HACÉ TU PEDIDO POR WHATSAPP O VISITANOS EN NUESTROS LOCALES! 🏪🤝

Chateá directamente con nuestros asesores de venta:
📍 General Roca (Casa Central): Av. Roca 1350 • WhatsApp: 298 453-6376
📍 Neuquén Capital: Mitre 678 • WhatsApp: 299 509-3911

💳 Aceptamos 3 y 6 Cuotas con BPN y 10% OFF por transferencia. ¡Envíos a todo el Alto Valle!

#WhatsApp #Pedidos #AtencionPersonalizada #KoalaLoTiene #GeneralRoca #Neuquen`,
    taggedProductSkus: ['KOA-POL-100', 'KOA-COT-114']
  }
];
