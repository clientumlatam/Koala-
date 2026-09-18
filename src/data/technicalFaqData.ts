export interface TechnicalFaqItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  details: string[];
  specsTable?: { label: string; value: string }[];
  recommendedUse: string;
  whatsappQuery: string;
}

export const TECHNICAL_MATERIAL_FAQS: TechnicalFaqItem[] = [
  {
    id: 'micronaje-micras',
    title: '¿Qué espesor en micrones (micras) necesito para mis bolsas?',
    category: 'Polietileno & Calibres',
    badge: 'Micras / Espesor',
    summary: 'El micrón (µm) determina el grosor y resistencia mecánica al estiramiento y rasgado del polietileno.',
    details: [
      '12 a 18 Micras: Bolsas camiseta súper livianas para panadería, farmacias y comercio general.',
      '25 a 35 Micras: Bolsas para indumentaria, fiambrería y bolsas de consorcio estándar.',
      '45 a 60 Micras: Bolsas de consorcio reforzadas para residuos pesados, consorcios y gastronomía.',
      '80 a 120 Micras: Bolsas de alta densidad para escombros, leña, hielo e industria pesada.'
    ],
    specsTable: [
      { label: 'Camiseta Liviana', value: '15 µm (Panaderías)' },
      { label: 'Camiseta Reforzada', value: '25 µm (Supermercados)' },
      { label: 'Consorcio Reforzada', value: '50 µm (Hotelería/Resto)' },
      { label: 'Bolsa Industrial/Leña', value: '80 - 100 µm' }
    ],
    recommendedUse: 'Comercios, supermercados, municipios e industrias del Alto Valle.',
    whatsappQuery: 'Hola Koala! Quisiera asesoramiento sobre qué espesor en micrones necesito para mis bolsas.'
  },
  {
    id: 'pead-vs-pebd',
    title: 'Diferencias clave entre Polietileno PEAD vs. PEBD',
    category: 'Tipos de Polímeros',
    badge: 'PEAD vs. PEBD',
    summary: 'La densidad del polietileno cambia la textura, brillo, transparencia y comportamiento mecánico.',
    details: [
      'PEAD (Polietileno de Alta Densidad): Es opaco, rígido y crujiente al tacto. Ofrece la mayor resistencia al peso sin estirarse (ideal para bolsas camiseta y arranque).',
      'PEBD (Polietileno de Baja Densidad): Es elástico, brillante y transparente. Es resistente al punzonado de objetos con filo o bordes (ideal para fiambrería, indumentaria y bolsas de residuos reforzadas).'
    ],
    specsTable: [
      { label: 'Textura PEAD', value: 'Rígida, crujiente, mate' },
      { label: 'Textura PEBD', value: 'Flexible, elástica, transparente' },
      { label: 'Mayor Fortaleza PEAD', value: 'Soporta más peso sin deformarse' },
      { label: 'Mayor Fortaleza PEBD', value: 'Soporta objetos punzantes' }
    ],
    recommendedUse: 'Indumentaria usa PEBD por estética; Supermercados y almacenes usan PEAD por costo/peso.',
    whatsappQuery: 'Hola Koala! Quisiera saber la diferencia entre PEAD y PEBD para pedir mis bolsas impresas.'
  },
  {
    id: 'film-stretch',
    title: 'Rendimiento y especificaciones del Film Stretch',
    category: 'Embalaje & Palletizado',
    badge: 'Stretch Pallet',
    summary: 'Film co-extruido auto-adherente para consolidación de pallets y protección de mercadería en fletes.',
    details: [
      'Ancho estándar: 50 cm.',
      'Espesores: 20 y 23 micrones con memoria elástica de hasta 250% de pre-estirado.',
      'Presentaciones: Con mango aplicador de cartón (1.5 kg a 4 kg) o versión sin mango para máquinas enfardadoras.',
      'Variante Negro Opaco: Brinda seguridad al ocultar la carga en fletes de larga distancia.'
    ],
    specsTable: [
      { label: 'Ancho Estándar', value: '500 mm (50 cm)' },
      { label: 'Espesor Micrones', value: '20 µm / 23 µm' },
      { label: 'Estiramiento Máx', value: 'Hasta 250% sin rotura' },
      { label: 'Coloración', value: 'Cristal transparente o Negro seguridad' }
    ],
    recommendedUse: 'Depósitos, bodegas, distribuidoras y mudanzas en el Alto Valle.',
    whatsappQuery: 'Hola Koala! Necesito cotización de bobinas de Film Stretch cristal o negro para palletizar.'
  },
  {
    id: 'big-bags-resistencia',
    title: 'Capacidad y carga útil de Big Bags (SWL 1000 kg)',
    category: 'Carga Pesada & Áridos',
    badge: '1 Tonelada',
    summary: 'Contenedores flexibles de tejido trenzado de polipropileno para 1.000 kg de carga SWL.',
    details: [
      'SWL (Safety Working Load): 1.000 kg comprobados.',
      'Material: Polipropileno virgen laminado con aditivo Anti-UV para intemperie.',
      'Estructura: 4 asas reforzadas en las esquinas para elevación con clark o grúa.',
      'Boca de Carga / Válvula de Cierre: Evita dispersión de polvos, escombros o fertilizantes.'
    ],
    specsTable: [
      { label: 'Carga Máxima', value: '1.000 kg (1 Tonelada)' },
      { label: 'Medidas Estándar', value: '90 x 90 x 120 cm' },
      { label: 'Factor de Seguridad', value: '5:1' },
      { label: 'Añadidos', value: 'Tratamiento UV + Válvula' }
    ],
    recommendedUse: 'Corralones, minería, fruta, fertilizantes y escombros de obra.',
    whatsappQuery: 'Hola Koala! Quisiera cotizar Big Bags de 1 Tonelada para carga pesada.'
  },
  {
    id: 'aptitud-alimentaria',
    title: 'Certificación de Aptitud Alimentaria y BPA Free',
    category: 'Gastronomía & Seguridad',
    badge: 'Senasa / SENASA',
    summary: 'Todos los productos plásticos vírgenes de Koala Lo Tiene son inocuos para contacto directo con comida.',
    details: [
      'Bolsas para Fiambrería / Separadores: Fabricados con polietileno 100% virgen grado alimenticio sin reciclados.',
      'Potes Térmicos y Envases PET: Aptos para frío (heladería/congelados) y caliente (sopas/viandas microondas).',
      'Libres de BPA y Ftalatos: No transfieren sabor ni olor a los alimentos.'
    ],
    specsTable: [
      { label: 'Materia Prima', value: '100% Polietileno Virgen' },
      { label: 'BPA Free', value: 'Sí, certificado libre de Bisfenol A' },
      { label: 'Apto Microondas', value: 'Envases PP / Polipropileno' },
      { label: 'Apto Congelado', value: 'Potes PET y Telgopor térmico' }
    ],
    recommendedUse: 'Rotiserías, heladerías, panaderías y emprendedores gastronómicos.',
    whatsappQuery: 'Hola Koala! Necesito confirmar la aptitud alimentaria de los envases descartables para mi comercio.'
  }
];
