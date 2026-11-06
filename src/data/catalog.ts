export type CollectionId =
  | 'all'
  | 'sofas-living'
  | 'modern-bedroom'
  | 'dining-tables-chairs'
  | 'wardrobes-storage'
  | 'office-chairs'
  | 'designer-furniture';

export type RoomId = 'living' | 'bedroom' | 'dining' | 'dressing';

export type ShowcaseTier = 'all' | 'featured' | 'bestseller' | 'new-arrival' | 'special-offer';

export type TransformationMode =
  | 'dining-assembly'
  | 'wardrobe-open'
  | 'bed-furnish'
  | 'sofa-orbital';

export type AspectRatioOption =
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '9:16'
  | '16:9'
  | '21:9';

export type FurnitureModelType =
  | 'curved_sofa'
  | 'platform_bed'
  | 'travertine_dining'
  | 'plinth_coffee_table'
  | 'fluted_wardrobe'
  | 'ceramic_vessels'
  | 'sculptural_lounge_chair'
  | 'floating_nightstand'
  | 'curved_dining_chair'
  | 'brass_side_table'
  | 'limestone_credenza'
  | 'executive_office_chair';

export interface CollectionMeta {
  id: Exclude<CollectionId, 'all'>;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  architecturalNote: string;
  roomId: RoomId;
  coverImage: string;
  imagePosition?: string;
}

export interface ProductFinish {
  name: string;
  swatchHex: string;
  woodHex: string;
  fabricHex: string;
  accentHex: string;
}

export interface FurnitureProduct {
  id: string;
  name: string;
  collectionId: Exclude<CollectionId, 'all'>;
  collectionLabel: string;
  roomId: RoomId;
  price: number;
  originalPrice?: number;
  showcaseTiers: Exclude<ShowcaseTier, 'all'>[];
  dimensions: string;
  materials: string;
  leadTime: string;
  description: string;
  architecturalStory: string;
  image: string;
  secondaryImage: string;
  imagePosition?: string;
  modelType: FurnitureModelType;
  finishes: ProductFinish[];
  featuredOrder: number;
  roomPosition: [number, number, number];
}

export interface RoomZone {
  id: RoomId;
  indexLabel: string;
  name: string;
  subtitle: string;
  description: string;
  sunlightNote: string;
  materialPalette: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  sunPosition: [number, number, number];
}

export interface CartItem {
  productId: string;
  finishName: string;
  quantity: number;
}

export const ASPECT_RATIO_OPTIONS: {
  value: AspectRatioOption;
  label: string;
  useCase: string;
}[] = [
  { value: '1:1', label: '1:1', useCase: 'Square Pedestal Study' },
  { value: '2:3', label: '2:3', useCase: 'Tall Editorial Vignette' },
  { value: '3:2', label: '3:2', useCase: 'Classic 35mm Showroom' },
  { value: '3:4', label: '3:4', useCase: 'Vertical Gallery Frame' },
  { value: '4:3', label: '4:3', useCase: 'Architectural Salon' },
  { value: '9:16', label: '9:16', useCase: 'Full-Height Monolith' },
  { value: '16:9', label: '16:9', useCase: 'Widescreen Showroom' },
  { value: '21:9', label: '21:9', useCase: 'Anamorphic Cinema' },
];

export const ROOM_ZONES: RoomZone[] = [
  {
    id: 'living',
    indexLabel: '01',
    name: 'Sovereign Sofa Vault',
    subtitle: 'Obsidian Velvet, 24K Gold Energy Rings & Reflective Nero Marble',
    description:
      'The centerpiece of the DREAMHOME showroom: a floating crescent sofa suspended above a glossy black marble circular platform ringed with rotating golden light conduits.',
    sunlightNote: 'Focused 3200K Golden Spotlights · 360° Orbital Stage',
    materialPalette: 'Obsidian Silk Velvet · Champagne Nubuck · Brushed 24K Gold',
    cameraPos: [-3.8, 2.7, 6.2],
    cameraTarget: [-2.6, 0.55, 0.2],
    sunPosition: [8, 12, 8],
  },
  {
    id: 'dining',
    indexLabel: '02',
    name: 'Imperial Dining Rotunda',
    subtitle: 'Nero Marquina Marble, Interlocking Gold Beams & Espresso Leather',
    description:
      'Dramatic overhead spotlights illuminate a sculptural black and gold marble dining table flanked by aerodynamic full-grain leather armchairs on an illuminated gold ring plinth.',
    sunlightNote: 'High-Contrast Cinema Key Light · Golden Floor Strips',
    materialPalette: 'Nero Marquina Marble · Brushed Champagne Gold · Espresso Leather',
    cameraPos: [3.8, 2.7, 6.2],
    cameraTarget: [3.8, 0.55, 0.2],
    sunPosition: [6, 13, 10],
  },
  {
    id: 'bedroom',
    indexLabel: '03',
    name: 'Apex King Suite Stage',
    subtitle: 'Cantilevered Smoked Walnut, Charcoal Nubuck & Underglow Plinth',
    description:
      'A futuristic king-size architectural bed hovering above a veined black marble platform with recessed warm golden light strips and a channeled leather wing headboard.',
    sunlightNote: 'Golden Rim Backlighting · Zero-Gravity Plinth Glow',
    materialPalette: 'Smoked Black Walnut · Charcoal Nubuck · Satin Gold Channeling',
    cameraPos: [-3.8, 2.6, -0.4],
    cameraTarget: [-2.6, 0.55, -5.2],
    sunPosition: [-8, 10, 6],
  },
  {
    id: 'dressing',
    indexLabel: '04',
    name: 'Executive & Atelier Wing',
    subtitle: 'Fluted Bronze Vitrines, Carbon-Gold Seating & Sculptural Objects',
    description:
      'Floor-to-ceiling fluted dark oak and bronze glass wardrobes paired with carbon-and-gold executive seating on dedicated rotating showroom turntables.',
    sunlightNote: '2700K Internal Vitrine Glow & Overhead Golden Beam',
    materialPalette: 'Fluted Smoked Oak · Carbon Fiber · Cognac Full-Grain Leather',
    cameraPos: [3.8, 2.6, -0.4],
    cameraTarget: [3.8, 0.7, -5.2],
    sunPosition: [8, 11, -2],
  },
];

// Exact User-Uploaded Furniture Images (served from /public/assets/aistudio for Vercel & local builds)
export const UPLOADED_SOFA_SECTIONAL = '/assets/aistudio/image_9a06a734.png';
export const UPLOADED_SOFA_BOUCLE = '/assets/aistudio/image_3000d7e8.png';
export const UPLOADED_BED_KING = '/assets/aistudio/image_14a5aee4.png';
export const UPLOADED_DINING_SUITE = '/assets/aistudio/image_3fb6bdc4.png';
export const UPLOADED_WARDROBE_STORAGE = '/assets/aistudio/image_871bc257.png';
export const UPLOADED_COFFEE_TABLE = '/assets/aistudio/image_38732a38.png';
export const UPLOADED_ARCHITECTURAL_LOUNGE = '/assets/aistudio/image_025f9b18.png';

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 'sofas-living',
    number: '01',
    title: 'Luxury Sofas',
    shortTitle: 'Luxury Sofas',
    subtitle: 'Architectural sectional sofas, bouclé lounge silhouettes, and tailored living room ensembles.',
    architecturalNote: 'Engineered to float above illuminated circular showroom platforms.',
    roomId: 'living',
    coverImage: UPLOADED_SOFA_SECTIONAL,
    imagePosition: 'center 68%',
  },
  {
    id: 'modern-bedroom',
    number: '02',
    title: 'King-Size Beds',
    shortTitle: 'King-Size Beds',
    subtitle: 'Geometric gold-inlaid upholstered king-size beds with matching bedside nightstands and warm lighting.',
    architecturalNote: 'Includes integrated bedside pedestals and Diagonal Brushed-Gold Channeling.',
    roomId: 'bedroom',
    coverImage: UPLOADED_BED_KING,
    imagePosition: 'center 62%',
  },
  {
    id: 'dining-tables-chairs',
    number: '03',
    title: 'Dining Tables',
    shortTitle: 'Dining Tables',
    subtitle: 'Sculptural monolith pedestal dining tables paired with two-tone gold-tipped dining armchairs.',
    architecturalNote: 'Modular multi-part stone and gold pedestals that assemble with precision.',
    roomId: 'dining',
    coverImage: UPLOADED_DINING_SUITE,
    imagePosition: 'center 72%',
  },
  {
    id: 'wardrobes-storage',
    number: '04',
    title: 'Modern Wardrobes',
    shortTitle: 'Modern Wardrobes',
    subtitle: 'Arched brass shelving vitrines, dark-paneled storage architecture, and bespoke dressing salon pieces.',
    architecturalNote: 'Precision articulated storage systems with warm gallery illumination.',
    roomId: 'dressing',
    coverImage: UPLOADED_WARDROBE_STORAGE,
    imagePosition: 'center 52%',
  },
  {
    id: 'office-chairs',
    number: '05',
    title: 'Office Chairs',
    shortTitle: 'Office Chairs',
    subtitle: 'Polished chrome and full-grain leather executive and studio chairs engineered for modern salons.',
    architecturalNote: 'Balanced on architectural bases with 360° showroom rotation.',
    roomId: 'dressing',
    coverImage: UPLOADED_ARCHITECTURAL_LOUNGE,
    imagePosition: 'center 75%',
  },
  {
    id: 'designer-furniture',
    number: '06',
    title: 'Designer Furniture',
    shortTitle: 'Designer Furniture',
    subtitle: 'Sculptural organic timber coffee tables, curved metal plinth bases, and artisanal ceramic vessels.',
    architecturalNote: 'Limited-edition sculptural statements crafted for private collectors.',
    roomId: 'living',
    coverImage: UPLOADED_COFFEE_TABLE,
    imagePosition: 'center 60%',
  },
];

export const PRODUCTS: FurnitureProduct[] = [
  {
    id: 'sovereign-orbital-sofa',
    name: 'Sovereign Grand L-Sectional Luxury Sofa',
    collectionId: 'sofas-living',
    collectionLabel: 'Luxury Sofas',
    roomId: 'living',
    price: 16800,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '350 × 170 × 76 cm',
    materials: 'Alabaster Performance Velvet, Kiln-Dried Hardwood Frame, Brushed Gold Accents',
    leadTime: 'Showroom Ready · White-Glove Dispatch',
    description:
      'An expansive architectural L-shaped sectional sofa with deep chaise lounge cushioning, tailored bolster pillows, and a low-profile gallery silhouette.',
    architecturalStory:
      'Designed as the hero star of the DREAMHOME showroom, suspended above a reflective black marble pedestal with twin rotating golden energy rings.',
    image: UPLOADED_SOFA_SECTIONAL,
    secondaryImage: UPLOADED_SOFA_BOUCLE,
    imagePosition: 'center 70%',
    modelType: 'curved_sofa',
    finishes: [
      {
        name: 'Obsidian Velvet & Champagne Gold',
        swatchHex: '#D6A342',
        woodHex: '#1F1914',
        fabricHex: '#D8C3A5',
        accentHex: '#FFC857',
      },
      {
        name: 'Royal Espresso Leather & 24K Gold',
        swatchHex: '#5C3A21',
        woodHex: '#2B1D12',
        fabricHex: '#8C6239',
        accentHex: '#D6A342',
      },
      {
        name: 'Alabaster Bouclé & Brushed Brass',
        swatchHex: '#F3EFE6',
        woodHex: '#5A432C',
        fabricHex: '#F3EFE6',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 1,
    roomPosition: [-3.4, 0, 0.2],
  },
  {
    id: 'apex-cantilever-king-bed',
    name: 'Apex Geometric Gold-Inlaid Luxury King Bed',
    collectionId: 'modern-bedroom',
    collectionLabel: 'King-Size Beds',
    roomId: 'bedroom',
    price: 14200,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '285 × 235 × 118 cm',
    materials: 'Cream Full-Grain Nappa Leather, Diagonal 24K Gold Trim, Quilted Silk Bedding',
    leadTime: 'Made to order · 3 Weeks',
    description:
      'A monumental king-size sanctuary bed featuring an upholstered cream leather headboard divided by diagonal brushed-gold architectural inlays and matching platform rails.',
    architecturalStory:
      'Engineered on a recessed Nero Marquina marble plinth with integrated 2700K golden perimeter underglow.',
    image: UPLOADED_BED_KING,
    secondaryImage: UPLOADED_WARDROBE_STORAGE,
    imagePosition: 'center 62%',
    modelType: 'platform_bed',
    finishes: [
      {
        name: 'Champagne Nappa & 24K Gold Trim',
        swatchHex: '#E5DBC9',
        woodHex: '#4A3525',
        fabricHex: '#E5DBC9',
        accentHex: '#D6A342',
      },
      {
        name: 'Charcoal Nubuck & Smoked Walnut',
        swatchHex: '#2C2825',
        woodHex: '#2E2016',
        fabricHex: '#3B3632',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 2,
    roomPosition: [-3.4, 0, -5.2],
  },
  {
    id: 'eclipse-nero-gold-dining-table',
    name: 'Eclipse Sculptural Pedestal Dining Table',
    collectionId: 'dining-tables-chairs',
    collectionLabel: 'Dining Tables',
    roomId: 'dining',
    price: 15400,
    originalPrice: 17900,
    showcaseTiers: ['featured', 'special-offer'],
    dimensions: '300 × 130 × 76 cm',
    materials: 'Polished Lacquered Stone Tabletop, Faceted Monolith Pedestal, Brushed Brass Base',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'A sleek contemporary dining table supported by a faceted architectural center column and brushed metallic floor plate, surrounded by tailored two-tone armchairs.',
    architecturalStory:
      'Precision-machined in modular components that lock together without visible fasteners for a dramatic kinetic assembly.',
    image: UPLOADED_DINING_SUITE,
    secondaryImage: UPLOADED_COFFEE_TABLE,
    imagePosition: 'center 72%',
    modelType: 'travertine_dining',
    finishes: [
      {
        name: 'Polished Taupe Stone & Brushed Gold',
        swatchHex: '#C5B8A5',
        woodHex: '#D6A342',
        fabricHex: '#292522',
        accentHex: '#FFC857',
      },
      {
        name: 'Nero Marquina Marble & 24K Gold',
        swatchHex: '#1A1817',
        woodHex: '#B6946A',
        fabricHex: '#E5DBC9',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 3,
    roomPosition: [3.2, 0, 0.2],
  },
  {
    id: 'valkyrie-carbon-gold-office-chair',
    name: 'Valkyrie Polished Chrome & Leather Studio Chair',
    collectionId: 'office-chairs',
    collectionLabel: 'Office Chairs',
    roomId: 'dressing',
    price: 5400,
    showcaseTiers: ['featured', 'new-arrival', 'bestseller'],
    dimensions: '68 × 72 × 124 cm',
    materials: 'Mirror-Polished Architectural Frame, Tailored Leather Upholstery, Gold Accents',
    leadTime: 'In Stock · Express Courier',
    description:
      'A futuristic cantilevered studio and executive chair combining a reflective metallic frame with ergonomic upholstered seating for modern architectural workspaces.',
    architecturalStory:
      'Built for zero-fatigue command in private studies and architectural penthouses.',
    image: UPLOADED_ARCHITECTURAL_LOUNGE,
    secondaryImage: UPLOADED_WARDROBE_STORAGE,
    imagePosition: 'center 78%',
    modelType: 'executive_office_chair',
    finishes: [
      {
        name: 'Champagne Leather & Polished Gold',
        swatchHex: '#D6A342',
        woodHex: '#1C1A17',
        fabricHex: '#D8C3A5',
        accentHex: '#FFC857',
      },
      {
        name: 'Obsidian Nappa Leather & Bright Gold',
        swatchHex: '#181615',
        woodHex: '#181615',
        fabricHex: '#24201E',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 4,
    roomPosition: [2.1, 0, -4.6],
  },
  {
    id: 'atelier-fluted-oak-wardrobe',
    name: 'Chronos Arched Brass & Obsidian Wardrobe Vitrine',
    collectionId: 'wardrobes-storage',
    collectionLabel: 'Modern Wardrobes',
    roomId: 'dressing',
    price: 18900,
    originalPrice: 21500,
    showcaseTiers: ['featured', 'special-offer'],
    dimensions: '320 × 64 × 260 cm',
    materials: 'Brushed 24K Brass Arched Frame, Smoked Dark Oak Panels, 2700K LED Vitrines',
    leadTime: 'Bespoke Commission · 4 Weeks',
    description:
      'An architectural dark-luxury wardrobe and arched brass display vitrine system that illuminates curated garments, objets d’art, and private collections.',
    architecturalStory:
      'Integrates warm golden light strips and precision-hinged doors for effortless interior access.',
    image: UPLOADED_WARDROBE_STORAGE,
    secondaryImage: UPLOADED_BED_KING,
    imagePosition: 'center 48%',
    modelType: 'fluted_wardrobe',
    finishes: [
      {
        name: 'Brushed 24K Gold & Obsidian Panel',
        swatchHex: '#D6A342',
        woodHex: '#241F1B',
        fabricHex: '#E6DEC8',
        accentHex: '#FFC857',
      },
      {
        name: 'Smoked Oak & Champagne Gold Vitrine',
        swatchHex: '#735338',
        woodHex: '#5C4028',
        fabricHex: '#D6A342',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 5,
    roomPosition: [3.4, 0, -5.8],
  },
  {
    id: 'quarry-plinth-coffee-table',
    name: 'Monolith Organic Timber & Curved Steel Coffee Table',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 4950,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '160 × 95 × 34 cm',
    materials: 'Sculpted Warm Oak Tabletop, Curved Obsidian Steel & Timber Base',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'An organic pebble-shaped solid timber coffee table poised on an intersecting curved black steel and wood sculptural loop base.',
    architecturalStory:
      'Anchors luxury lounge environments with fluid geometry and warm natural grain.',
    image: UPLOADED_COFFEE_TABLE,
    secondaryImage: UPLOADED_SOFA_SECTIONAL,
    imagePosition: 'center 62%',
    modelType: 'plinth_coffee_table',
    finishes: [
      {
        name: 'Natural Warm Oak & Obsidian Base',
        swatchHex: '#B88652',
        woodHex: '#9C7A54',
        fabricHex: '#E2D6C1',
        accentHex: '#D6A342',
      },
      {
        name: 'Nero Marquina & Bright Gold',
        swatchHex: '#1C1917',
        woodHex: '#1C1917',
        fabricHex: '#2A2521',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 6,
    roomPosition: [-2.1, 0, 1.0],
  },
  {
    id: 'arc-sculptural-lounge-chair',
    name: 'Hyperion Ivory Bouclé Sofa & Lounge Suite',
    collectionId: 'sofas-living',
    collectionLabel: 'Luxury Sofas',
    roomId: 'living',
    price: 4800,
    originalPrice: 5600,
    showcaseTiers: ['new-arrival', 'special-offer'],
    dimensions: '220 × 92 × 76 cm',
    materials: 'Textured Ivory Bouclé, Tapered Warm Oak Legs, Sculptural Bolster Pillows',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'A serene ivory bouclé sofa and barrel armchair ensemble featuring organic curved silhouettes, woven tactile cushions, and warm timber legs.',
    architecturalStory:
      'Rotates 360 degrees smoothly on our interactive showroom stage.',
    image: UPLOADED_SOFA_BOUCLE,
    secondaryImage: UPLOADED_SOFA_SECTIONAL,
    imagePosition: 'center 72%',
    modelType: 'sculptural_lounge_chair',
    finishes: [
      {
        name: 'Ivory Bouclé & Warm Oak',
        swatchHex: '#F3EFE6',
        woodHex: '#8C6944',
        fabricHex: '#F3EFE6',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 7,
    roomPosition: [-1.4, 0, 0.7],
  },
  {
    id: 'aurelia-dining-armchair-set',
    name: 'Aurelia Gold-Tipped Two-Tone Dining Chairs (Pair)',
    collectionId: 'dining-tables-chairs',
    collectionLabel: 'Dining Tables',
    roomId: 'dining',
    price: 3400,
    showcaseTiers: ['bestseller', 'new-arrival'],
    dimensions: '58 × 56 × 79 cm',
    materials: 'Two-Tone Velvet & Walnut Veneer Back, Brushed 24K Gold Leg Sabots',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'Sculpted wrap-around dining armchairs featuring contrasting cream and espresso upholstery with solid brushed brass leg sabots.',
    architecturalStory:
      'Designed as the companion seating to the Eclipse Sculptural Pedestal Dining Table.',
    image: UPLOADED_DINING_SUITE,
    secondaryImage: UPLOADED_ARCHITECTURAL_LOUNGE,
    imagePosition: 'center 78%',
    modelType: 'curved_dining_chair',
    finishes: [
      {
        name: 'Espresso & Cream with 24K Gold Sabots',
        swatchHex: '#382B22',
        woodHex: '#241B15',
        fabricHex: '#382B22',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 8,
    roomPosition: [4.4, 0, 0.2],
  },
  {
    id: 'cantilever-champagne-side-table',
    name: 'Halo Cantilevered Side Table & Drum Coffee Table',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 2350,
    originalPrice: 2800,
    showcaseTiers: ['special-offer', 'bestseller'],
    dimensions: 'Ø 88 × 42 cm · Side Table 48 × 58 cm',
    materials: 'Matte Obsidian Steel C-Frame, Solid Warm Walnut Drum & Tray Tops',
    leadTime: 'In Stock · Express Courier',
    description:
      'An architectural C-profile side table paired with a double-tier circular walnut coffee table designed to slide effortlessly alongside deep sectional sofas.',
    architecturalStory:
      'Engineered for versatile living room arrangements with clean geometric lines.',
    image: UPLOADED_SOFA_SECTIONAL,
    secondaryImage: UPLOADED_COFFEE_TABLE,
    imagePosition: '28% 76%',
    modelType: 'brass_side_table',
    finishes: [
      {
        name: 'Smoked Walnut & Obsidian Frame',
        swatchHex: '#6E5036',
        woodHex: '#4A3423',
        fabricHex: '#EAE1D3',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 9,
    roomPosition: [-4.5, 0, 0.6],
  },
  {
    id: 'horizon-floating-nightstand-pair',
    name: 'Horizon Gold-Trimmed 3-Drawer Nightstands (Pair)',
    collectionId: 'modern-bedroom',
    collectionLabel: 'King-Size Beds',
    roomId: 'bedroom',
    price: 3800,
    showcaseTiers: ['new-arrival'],
    dimensions: '64 × 46 × 62 cm (Each)',
    materials: 'Cream Lacquered Hardwood, Brushed 24K Gold Beveled Frame & Ring Pulls',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'A matched pair of luxury three-drawer bedside chests framed in brushed gold with classical urn table lamps for warm ambient bedroom illumination.',
    architecturalStory:
      'Flanks the Apex King Bed for a symmetrical hotel-suite sanctuary.',
    image: UPLOADED_BED_KING,
    secondaryImage: UPLOADED_SOFA_BOUCLE,
    imagePosition: '88% 70%',
    modelType: 'floating_nightstand',
    finishes: [
      {
        name: 'Cream Lacquer & 24K Brushed Gold',
        swatchHex: '#E8DFC8',
        woodHex: '#5C4028',
        fabricHex: '#2B2623',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 10,
    roomPosition: [-4.8, 0, -5.4],
  },
  {
    id: 'verona-limestone-credenza',
    name: 'Vanguard Dark Salon Credenza & Tufted Ottoman Suite',
    collectionId: 'wardrobes-storage',
    collectionLabel: 'Modern Wardrobes',
    roomId: 'dressing',
    price: 8400,
    showcaseTiers: ['new-arrival'],
    dimensions: '220 × 50 × 76 cm',
    materials: 'Charcoal Paneling, Brushed Brass Hardware, Deep-Tufted Velvet & Leather',
    leadTime: 'Made to order · 3 Weeks',
    description:
      'A moody dark-luxury dressing salon ensemble combining brass-framed storage cabinetry with a deep button-tufted velvet ottoman and club armchair.',
    architecturalStory:
      'Anchors executive dressing rooms and private cinema salons.',
    image: UPLOADED_WARDROBE_STORAGE,
    secondaryImage: UPLOADED_DINING_SUITE,
    imagePosition: 'center 78%',
    modelType: 'limestone_credenza',
    finishes: [
      {
        name: 'Obsidian Slate & Brushed Brass',
        swatchHex: '#33383B',
        woodHex: '#241F1B',
        fabricHex: '#292522',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 11,
    roomPosition: [4.6, 0, -4.8],
  },
  {
    id: 'solis-travertine-vessel-trio',
    name: 'Aether Tiered Pedestal Table & Sculptural Vessels',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 1950,
    originalPrice: 2400,
    showcaseTiers: ['new-arrival', 'special-offer'],
    dimensions: 'Table Ø 90 × 44 cm · Vessels H 24–42 cm',
    materials: 'Brass-Column Tiered Table, Luminous Sphere Diffuser, Ceramic Vessels',
    leadTime: 'In Stock · Express Courier',
    description:
      'An art-directed ensemble pairing a two-tier circular table on brushed gold columns with a glowing spherical centerpiece and sculptural ceramic vessels.',
    architecturalStory:
      'Casts a warm cinematic golden halo across luxury lounge interiors.',
    image: UPLOADED_ARCHITECTURAL_LOUNGE,
    secondaryImage: UPLOADED_COFFEE_TABLE,
    imagePosition: 'center 68%',
    modelType: 'ceramic_vessels',
    finishes: [
      {
        name: 'Sage & 24K Gold Columns',
        swatchHex: '#D6A342',
        woodHex: '#8C6944',
        fabricHex: '#F5F0E6',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 12,
    roomPosition: [-4.5, 0, -0.5],
  },
];

export interface FilterOptions {
  category: CollectionId;
  showcaseTier?: ShowcaseTier;
  roomFilter?: RoomId | 'all';
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
}

export function filterAndSortProducts(
  products: FurnitureProduct[],
  options: FilterOptions
): FurnitureProduct[] {
  const query = options.searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    if (options.category !== 'all' && item.collectionId !== options.category) {
      return false;
    }
    if (
      options.showcaseTier &&
      options.showcaseTier !== 'all' &&
      !item.showcaseTiers.includes(options.showcaseTier)
    ) {
      return false;
    }
    if (options.roomFilter && options.roomFilter !== 'all' && item.roomId !== options.roomFilter) {
      return false;
    }
    if (query.length > 0) {
      const searchable = `${item.name} ${item.collectionLabel} ${item.materials} ${item.description}`.toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (options.sortBy === 'price-asc') return a.price - b.price;
    if (options.sortBy === 'price-desc') return b.price - a.price;
    return a.featuredOrder - b.featuredOrder;
  });
}

export interface CartSummary {
  subtotal: number;
  whiteGloveDelivery: number;
  total: number;
  itemCount: number;
}

export function calculateCartSummary(
  cartItems: CartItem[],
  products: FurnitureProduct[]
): CartSummary {
  let subtotal = 0;
  let itemCount = 0;

  for (const entry of cartItems) {
    if (entry.quantity <= 0) continue;
    const product = products.find((p) => p.id === entry.productId);
    if (product) {
      subtotal += product.price * entry.quantity;
      itemCount += entry.quantity;
    }
  }

  const whiteGloveDelivery = itemCount === 0 ? 0 : subtotal >= 10000 ? 0 : 250;
  return {
    subtotal,
    whiteGloveDelivery,
    total: subtotal + whiteGloveDelivery,
    itemCount,
  };
}

export function updateCartItemQuantity(
  cartItems: CartItem[],
  productId: string,
  finishName: string,
  delta: number
): CartItem[] {
  const existingIndex = cartItems.findIndex(
    (item) => item.productId === productId && item.finishName === finishName
  );

  if (existingIndex === -1) {
    if (delta <= 0) return cartItems;
    return [...cartItems, { productId, finishName, quantity: delta }];
  }

  const nextQty = cartItems[existingIndex].quantity + delta;
  if (nextQty <= 0) {
    return cartItems.filter((_, idx) => idx !== existingIndex);
  }

  return cartItems.map((item, idx) =>
    idx === existingIndex ? { ...item, quantity: nextQty } : item
  );
}

export function toggleWishlistItem(wishlist: string[], productId: string): string[] {
  if (wishlist.includes(productId)) {
    return wishlist.filter((id) => id !== productId);
  }
  return [...wishlist, productId];
}

export interface RoomFurnishTransform {
  localProgress: number;
  scale: number;
  elevationY: number;
  opacity: number;
  phaseLabel: string;
}

export function computeRoomFurnishState(
  progress: number,
  itemIndex: number,
  totalItems: number
): RoomFurnishTransform {
  const clamped = Math.max(0, Math.min(1, progress));
  const safeTotal = Math.max(1, totalItems);
  const staggerWindow = 0.45;
  const startOffset = (itemIndex / safeTotal) * staggerWindow;
  const duration = 1 - staggerWindow;
  const rawLocal = (clamped - startOffset) / duration;
  const localProgress = Math.max(0, Math.min(1, rawLocal));

  const eased = 1 - Math.pow(1 - localProgress, 3);

  let phaseLabel = 'Empty Obsidian Stage';
  if (clamped >= 0.95) {
    phaseLabel = 'Full Showroom Illumination';
  } else if (clamped >= 0.6) {
    phaseLabel = 'Engaging Golden Energy Rings';
  } else if (clamped >= 0.2) {
    phaseLabel = 'Materializing 3D Furniture';
  }

  return {
    localProgress: eased,
    scale: 0.001 + eased * 0.999,
    elevationY: (1 - eased) * 1.15,
    opacity: eased,
    phaseLabel,
  };
}

export interface KineticTransformationMetrics {
  mode: TransformationMode;
  progress: number;
  stageCaption: string;
  // Dining table assembly metrics
  pedestalSpreadX: number;
  tabletopLiftY: number;
  // Wardrobe opening metrics
  doorOpenAngleDeg: number;
  interiorGlowIntensity: number;
  // Bed transformation metrics
  bedLayerCount: number;
  // Sofa orbital metrics
  sofaOrbitAngleDeg: number;
  ringEnergySpeed: number;
}

/**
 * Pure kinematic calculator for Section 5 (Cinematic Product Transformation):
 * - Dining table assembling from separate components
 * - Wardrobe opening doors to reveal illuminated interior
 * - Bed transforming from bare frame into luxury king-size bed
 * - Sofa rotating 360 degrees with golden energy rings
 */
export function computeTransformationStage(
  mode: TransformationMode,
  rawProgress: number
): KineticTransformationMetrics {
  const p = Math.max(0, Math.min(1, rawProgress));
  const eased = 1 - Math.pow(1 - p, 3);

  // 1. Dining assembly: at p=0 components are separated; at p=1 locked together
  const pedestalSpreadX = Number(((1 - eased) * 1.15).toFixed(3));
  const tabletopLiftY = Number(((1 - eased) * 0.95).toFixed(3));

  // 2. Wardrobe doors: swing open up to 108 degrees as p -> 1
  const doorOpenAngleDeg = Math.round(eased * 108);
  const interiorGlowIntensity = Number((0.15 + eased * 1.35).toFixed(2));

  // 3. Bed layers: 1 (Bare Frame) -> 2 (Mattress) -> 3 (Headboard) -> 4 (Pillows & Golden Throw)
  const bedLayerCount = p < 0.25 ? 1 : p < 0.55 ? 2 : p < 0.85 ? 3 : 4;

  // 4. Sofa orbital rotation: 0 to 360 deg
  const sofaOrbitAngleDeg = Math.round(p * 360);
  const ringEnergySpeed = Number((1 + eased * 2.5).toFixed(2));

  let stageCaption = '';
  if (mode === 'dining-assembly') {
    stageCaption =
      p < 0.3
        ? 'Components Suspended: Twin Marble Columns & Gold Collars'
        : p < 0.85
        ? 'Kinetic Alignment: Locking Structural Gold Beams'
        : 'Assembled: Eclipse Nero Marquina & 24K Gold Dining Table';
  } else if (mode === 'wardrobe-open') {
    stageCaption =
      p < 0.3
        ? 'Closed Monolith: Fluted Smoked Oak & Bronze Facade'
        : p < 0.85
        ? `Articulating Doors (${doorOpenAngleDeg}°): Activating 2700K Vitrine`
        : 'Full Interior Reveal: Illuminated Couture Shelving & Gold Channels';
  } else if (mode === 'bed-furnish') {
    stageCaption =
      bedLayerCount === 1
        ? 'Stage 1/4: Cantilevered Smoked Walnut & Gold Chassis Frame'
        : bedLayerCount === 2
        ? 'Stage 2/4: Lowering Dual-Core Orthopaedic Mattress'
        : bedLayerCount === 3
        ? 'Stage 3/4: Locking Channeled Charcoal Nubuck Wing Headboard'
        : 'Stage 4/4: Complete Luxury King Suite with Silk Bolsters & Gold Throw';
  } else {
    stageCaption = `360° Orbital Inspection (${sofaOrbitAngleDeg}°) · Dual Golden Energy Rings Active`;
  }

  return {
    mode,
    progress: p,
    stageCaption,
    pedestalSpreadX,
    tabletopLiftY,
    doorOpenAngleDeg,
    interiorGlowIntensity,
    bedLayerCount,
    sofaOrbitAngleDeg,
    ringEnergySpeed,
  };
}

export function parseAspectRatioDimensions(ratio: AspectRatioOption): {
  widthRatio: number;
  heightRatio: number;
  aspectNumeric: number;
} {
  const [w, h] = ratio.split(':').map(Number);
  const widthRatio = w > 0 ? w : 16;
  const heightRatio = h > 0 ? h : 9;
  return {
    widthRatio,
    heightRatio,
    aspectNumeric: Number((widthRatio / heightRatio).toFixed(4)),
  };
}
