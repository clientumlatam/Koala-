export interface FaqItem {
  question: string;
  answer: string;
  category: 'envios' | 'pedidos' | 'pagos' | 'locales' | 'facturacion';
}

export interface BranchDetail {
  id: string;
  name: string;
  role: string;
  city: string;
  province: string;
  address: string;
  postalCode: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappFormatted: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapsUrl: string;
  embedQuery: string;
  features: string[];
}

export const SUCURSALES_DATA: BranchDetail[] = [
  {
    id: 'roca',
    name: 'Casa Central & Planta Fabril General Roca',
    role: 'Fábrica de Polietileno, Centro de Distribución y Venta Minorista/Mayorista',
    city: 'General Roca',
    province: 'Río Negro',
    address: 'Av. Roca 1350',
    postalCode: '8332',
    phone: '(0298) 443-6639',
    phoneRaw: '02984436639',
    whatsapp: '542984536376',
    whatsappFormatted: '298 453-6376',
    email: 'lpsrlmilton@lpsrl.com.ar',
    hours: {
      weekdays: 'Lunes a Viernes: 08:30 a 12:30 hs y 16:00 a 20:00 hs',
      saturday: 'Sábados: 09:00 a 13:00 hs',
      sunday: 'Domingos: Cerrado',
    },
    mapsUrl: 'https://maps.google.com/?q=Av.+Roca+1350,+General+Roca,+Río+Negro',
    embedQuery: 'Av.+Roca+1350,+General+Roca,+Río+Negro',
    features: [
      'Planta de extrusión y confección de bolsas de polietileno',
      'Venta por mayor (bulto cerrado) y menor',
      'Atención comercial y retiro de presupuestos web',
      'Estacionamiento y carga para camionetas y camiones',
    ],
  },
  {
    id: 'neuquen',
    name: 'Sucursal Salón Comercial Neuquén Capital',
    role: 'Salón de Ventas, Showroom Gastronómico, Cotillón y Repostería',
    city: 'Neuquén Capital',
    province: 'Neuquén',
    address: 'Mitre 678',
    postalCode: '8300',
    phone: '(0299) 443-3960',
    phoneRaw: '02994433960',
    whatsapp: '542995093911',
    whatsappFormatted: '299 509-3911',
    email: 'nqn@koalalotiene.com.ar',
    hours: {
      weekdays: 'Lunes a Viernes: 08:30 a 12:30 hs y 16:00 a 20:00 hs',
      saturday: 'Sábados: 09:00 a 13:00 hs',
      sunday: 'Domingos: Cerrado',
    },
    mapsUrl: 'https://maps.google.com/?q=Mitre+678,+Neuquén+Capital',
    embedQuery: 'Mitre+678,+Neuquén+Capital',
    features: [
      'Showroom completo de descartables gastronómicos y viandas',
      'Sector exclusivo de cotillón, eventos y repostería artesanal',
      'Retiro en mostrador de pedidos web en Neuquén',
      'Asesoramiento a gastronómicos, rotiserías y salones de fiesta',
    ],
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    category: 'envios',
    question: '¿Hacen envíos a domicilio en el Alto Valle?',
    answer: 'Sí. Realizamos entregas programadas en General Roca y Neuquén Capital con vehículos propios. También coordinamos despachos para Cipolletti, Allen, Plottier, Fernández Oro, Cinco Saltos y localidades aledañas mediante expresos o comisionistas.',
  },
  {
    category: 'pedidos',
    question: '¿Cuál es la diferencia entre precio minorista y mayorista?',
    answer: 'En Koala podés comprar desde un paquete individual hasta bultos cerrados de fábrica. Para compras por bulto (por ejemplo 10 paquetes de bolsas o cajas completas de descartables) aplicamos tarifa mayorista directa con descuentos del 15% al 25% según el volumen.',
  },
  {
    category: 'pagos',
    question: '¿Qué formas de pago aceptan?',
    answer: 'Aceptamos efectivo en salón, transferencias bancarias inmediatas (con 10% de descuento en cotizaciones cerradas), tarjetas de débito y crédito en 3 y 6 cuotas sin interés con BPN Confiable, y QR / Mercado Pago.',
  },
  {
    category: 'locales',
    question: '¿Puedo armar mi pedido online y retirarlo en el local?',
    answer: '¡Por supuesto! Podés seleccionar tus productos en la tienda web, enviarnos la cotización por WhatsApp indicando tu sucursal de preferencia (General Roca o Neuquén) y te avisamos en cuanto esté embalado para que pases a retirar sin demoras.',
  },
  {
    category: 'facturacion',
    question: '¿Emiten Factura A para empresas y responsables inscriptos?',
    answer: 'Sí, emitimos Factura A y Factura B. Al confirmar tu compra indicanos CUIT y Razón Social y te enviamos el comprobante fiscal electrónico por correo o WhatsApp.',
  },
  {
    category: 'pedidos',
    question: '¿Hacen bolsas de polietileno impresas con logo personalizado?',
    answer: 'Sí, fabricamos bolsas camiseta, riñón y de consorcio con impresión personalizada a 1 o 2 tintas. La cantidad mínima depende del tamaño y espesor. Podés solicitar presupuesto en la sección Servicio Técnico y Fabricación.',
  },
];

export const POLITICAS_DEVOLUCION_TEXT = {
  title: 'Políticas de Cambios y Devoluciones',
  intro: 'En Koala Lo Tiene buscamos garantizar tu máxima satisfacción con cada compra tanto en nuestros locales como en pedidos web.',
  sections: [
    {
      title: 'Plazos para cambios',
      content: 'Disponés de 30 (treinta) días corridos desde la fecha de compra o recepción del producto para solicitar un cambio presentando el ticket o comprobante de compra.',
    },
    {
      title: 'Condiciones del producto',
      content: 'El producto debe encontrarse sin uso, en perfectas condiciones higiénicas y en su empaque original sellado. Por normativas bromatológicas y sanitarias, los artículos de repostería comestible, mangas o envases gastronómicos fraccionados que hayan sido abiertos o manipulados no admiten cambio, salvo falla comprobable de fábrica.',
    },
    {
      title: 'Garantía directa de fabricación de polietileno',
      content: 'Nuestras bolsas y bobinas de polietileno cuentan con garantía de resistencia y micraje real. En caso de detectar cualquier partida defectuosa en sellado o espesor, se realiza la reposición inmediata de los bultos afectados.',
    },
    {
      title: 'Costos de logística para cambios',
      content: 'Si el cambio se debe a un error de preparación imputable a Koala Lo Tiene, el retiro y reenvío corre por nuestra cuenta. Si el cambio responde a un cambio de preferencia del cliente, el traslado es a cargo del comprador o puede efectuarse sin costo en nuestras sucursales.',
    },
  ],
};

export const TERMINOS_CONDICIONES_TEXT = {
  title: 'Términos y Condiciones Generales',
  lastUpdated: 'Septiembre 2026',
  sections: [
    {
      title: '1. Ámbito de aplicación',
      content: 'El presente sitio web y catálogo comercial es operado por LP SRL (CUIT 30-59986913-8 — https://ventaslp.com/), con casa central y planta de fabricación en Av. Roca 1350, General Roca, Río Negro, y sucursales comerciales en la provincia de Neuquén.',
    },
    {
      title: '2. Presupuestos y Lista de Precios',
      content: 'Los precios publicados en la plataforma están expresados en Pesos Argentinos ($ ARS) e incluyen IVA. Las cotizaciones generadas a través del presupuestador web tienen una validez de 72 horas hábiles sujeta a confirmación de stock.',
    },
    {
      title: '3. Disponibilidad de Stock y Venta Mayorista',
      content: 'El stock de artículos de fábrica e importados se encuentra sincronizado con nuestro sistema ERP central. En caso de quiebre temporal de stock de algún bulto, el asesor se comunicará inmediatamente para ofrecer una alternativa de igual o superior calidad o el reintegro.',
    },
    {
      title: '4. Jurisdicción y Ley Aplicable',
      content: 'Cualquier controversia que se suscite en relación con las operaciones se regirá por las leyes de la República Argentina, sometiéndose a la competencia de los Tribunales Ordinarios de la Segunda Circunscripción Judicial de la Provincia de Río Negro.',
    },
  ],
};

export const PRIVACIDAD_TEXT = {
  title: 'Política de Privacidad y Confidencialidad',
  sections: [
    {
      title: 'Tratamiento responsable de datos',
      content: 'En LP SRL (ventaslp.com) protegemos la información personal y comercial de nuestros clientes. Los datos solicitados para generar cotizaciones (nombre, teléfono, correo, CUIT y dirección de entrega) son utilizados exclusivamente para procesar tus pedidos y brindarte soporte postventa.',
    },
    {
      title: 'Seguridad y no divulgación',
      content: 'Bajo ninguna circunstancia vendemos, cedemos o compartimos tus datos con terceros ajenos a la operación logística de despacho y facturación fiscal.',
    },
    {
      title: 'Uso de almacenamiento local y cookies',
      content: 'Utilizamos almacenamiento local en el navegador para recordar tus preferencias de sucursal activa (Roca o Neuquén), los artículos guardados en tu carrito de presupuesto y tu saldo del Club Koala.',
    },
  ],
};

export const DERECHOS_DATOS_TEXT = {
  title: 'Protección de Datos Personales (Ley 25.326)',
  sections: [
    {
      title: 'Marco Normativo Nacional',
      content: 'En cumplimiento de la Ley 25.326 de Protección de los Datos Personales (Habeas Data) y su Decreto Reglamentario 1558/01, LP SRL (https://ventaslp.com/) informa a todos los usuarios que los datos recolectados se incorporan a bases debidamente protegidas.',
    },
    {
      title: 'Derechos de Acceso, Rectificación y Supresión',
      content: 'El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses. Asimismo, podrá solicitar en cualquier momento la actualización, rectificación o supresión de sus registros de nuestras bases comerciales.',
    },
    {
      title: 'Canal oficial de atención para ejercicio de derechos',
      content: 'Para ejercer cualquiera de estos derechos, podés enviar un correo electrónico a legales@koalalotiene.com.ar con el asunto "Habeas Data - [Tu Nombre y DNI]". Te responderemos en un plazo máximo de 5 días hábiles.',
    },
    {
      title: 'Órgano de Control',
      content: 'La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.',
    },
  ],
};

export const SERVICIO_TECNICO_TEXT = {
  title: 'Fábrica & Asesoramiento Técnico de Polietileno',
  subtitle: 'Extrusión, Confección a Medida y Soluciones Industriales',
  intro: 'En nuestra planta fabril de General Roca producimos polietileno de alta y baja densidad para la industria frutícola, construcción, comercio y agro del Alto Valle.',
  services: [
    {
      title: 'Bolsas y Rollos a Medida',
      desc: 'Fabricación con espesores desde 15 hasta 120 micrones en film cristal, blanco, negro o color. Anchos desde 10 cm hasta 2,50 metros.',
    },
    {
      title: 'Bolsas Impresas con Marca',
      desc: 'Personalizá tus bolsas camiseta, tipo riñón o boutique con el logo y datos de tu comercio. Excelente definición flexográfica.',
    },
    {
      title: 'Film Stretch Manual y Automático',
      desc: 'Bobinas de film stretch virgen de 50 cm de ancho para paletizado industrial. Disponibles en cristal y negro con máxima elongación y memoria elástica.',
    },
    {
      title: 'Big Bags de 1 Tonelada',
      desc: 'Contenedores flexibles de polipropileno para áridos, escombros, minerales y transporte de cosecha frutícola a granel.',
    },
  ],
};

export const TRABAJA_CON_NOSOTROS_DATA = {
  title: 'Trabajá en Koala Lo Tiene',
  subtitle: 'Sumate al equipo líder en polietileno, descartables y cotillón de la región',
  areas: [
    {
      title: 'Operarios de Planta Fabril (General Roca)',
      desc: 'Manejo de extrusoras, selladoras automáticas y rebobinadoras de polietileno. Mantenimiento electromecánico y control de calidad.',
    },
    {
      title: 'Atención al Cliente y Ventas de Mostrador (Neuquén y Roca)',
      desc: 'Asesoramiento a clientes, rotiserías, pastelerías y público general. Manejo de caja, reposición y control de stock.',
    },
    {
      title: 'Logística y Choferes de Reparto (Alto Valle)',
      desc: 'Distribución y entrega de mercadería en camionetas utilitarias en General Roca, Neuquén, Cipolletti y zona.',
    },
  ],
};
