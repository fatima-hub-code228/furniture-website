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

const IMG_GOLD_SOFA = '/src/assets/images/dreamhome_gold_sofa_1793983301966.jpg';
const IMG_KING_BED = '/src/assets/images/dreamhome_king_bed_1793983303672.jpg';
const IMG_DINING_DARK = '/src/assets/images/dreamhome_dining_table_1793983304113.jpg';
const IMG_OFFICE_CHAIR = '/src/assets/images/dreamhome_office_chair_1793983305507.jpg';
const IMG_WARDROBE = '/src/assets/images/wardrobe_fluted_oak_1793981984358.jpg';
const IMG_COFFEE = '/src/assets/images/coffee_table_plinth_1793981984258.jpg';
const IMG_DECOR = '/src/assets/images/decor_ceramic_vessels_1793981985356.jpg';
const IMG_SOFA_ALT = '/src/assets/images/sofa_living_sanctuary_1793981980159.jpg';

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 'sofas-living',
    number: '01',
    title: 'Luxury Sofas',
    shortTitle: 'Luxury Sofas',
    subtitle: 'Aerodynamic curved velvet and champagne leather sofas with 24K gold inlay trim.',
    architecturalNote: 'Engineered to float above illuminated circular showroom platforms.',
    roomId: 'living',
    coverImage: IMG_GOLD_SOFA,
  },
  {
    id: 'modern-bedroom',
    number: '02',
    title: 'King-Size Beds',
    shortTitle: 'King-Size Beds',
    subtitle: 'Cantilevered king-size sanctuary beds with golden underglow and channeled leather.',
    architecturalNote: 'Includes integrated floating nightstands and acoustic winged headboards.',
    roomId: 'bedroom',
    coverImage: IMG_KING_BED,
  },
  {
    id: 'dining-tables-chairs',
    number: '03',
    title: 'Dining Tables',
    shortTitle: 'Dining Tables',
    subtitle: 'Sculptural Nero Marquina marble and interlocking brushed gold dining architecture.',
    architecturalNote: 'Modular multi-part stone and gold pedestals that assemble with precision.',
    roomId: 'dining',
    coverImage: IMG_DINING_DARK,
  },
  {
    id: 'wardrobes-storage',
    number: '04',
    title: 'Modern Wardrobes',
    shortTitle: 'Modern Wardrobes',
    subtitle: 'Motorized bronze glass vitrines and fluted timber cabinetry with golden LED strips.',
    architecturalNote: 'Precision 110-degree articulated doors reveal illuminated interior shelving.',
    roomId: 'dressing',
    coverImage: IMG_WARDROBE,
  },
  {
    id: 'office-chairs',
    number: '05',
    title: 'Office Chairs',
    shortTitle: 'Office Chairs',
    subtitle: 'Carbon-sculpted exoskeleton task seating wrapped in hand-stitched cognac leather.',
    architecturalNote: 'Balanced on a 5-point brushed champagne gold base with 360° swivel.',
    roomId: 'dressing',
    coverImage: IMG_OFFICE_CHAIR,
  },
  {
    id: 'designer-furniture',
    number: '06',
    title: 'Designer Furniture',
    shortTitle: 'Designer Furniture',
    subtitle: 'Monolithic stone plinth tables, cantilevered gold occasional pieces, and lighting.',
    architecturalNote: 'Limited-edition sculptural statements crafted for private collectors.',
    roomId: 'living',
    coverImage: IMG_COFFEE,
  },
];

export const PRODUCTS: FurnitureProduct[] = [
  {
    id: 'sovereign-orbital-sofa',
    name: 'Sovereign Orbital Velvet & Gold Sofa',
    collectionId: 'sofas-living',
    collectionLabel: 'Luxury Sofas',
    roomId: 'living',
    price: 16800,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '350 × 170 × 76 cm',
    materials: 'Obsidian Silk Velvet, Champagne Full-Grain Leather, 24K Brushed Gold Ribbing',
    leadTime: 'Showroom Ready · White-Glove Dispatch',
    description:
      'A sweeping futuristic crescent sofa with an obsidian velvet outer shell, champagne leather seating deck, and continuous brushed gold contour piping.',
    architecturalStory:
      'Designed as the hero star of the DREAMHOME showroom, suspended above a reflective black marble pedestal with twin rotating golden energy rings.',
    image: IMG_GOLD_SOFA,
    secondaryImage: IMG_SOFA_ALT,
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
        name: ' Royal Espresso Leather & 24K Gold',
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
    name: 'Apex Cantilevered Walnut & Gold King Bed',
    collectionId: 'modern-bedroom',
    collectionLabel: 'King-Size Beds',
    roomId: 'bedroom',
    price: 14200,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '285 × 235 × 118 cm',
    materials: 'Smoked Black Walnut, Charcoal Nubuck Leather, Brushed Gold Inlays',
    leadTime: 'Made to order · 3 Weeks',
    description:
      'A monumental king-size sanctuary bed featuring a horizontal channeled charcoal nubuck headboard framed by smoked walnut wings and brushed gold architectural strips.',
    architecturalStory:
      'Engineered on a recessed Nero Marquina marble plinth with integrated 2700K golden perimeter underglow.',
    image: IMG_KING_BED,
    secondaryImage: IMG_WARDROBE,
    modelType: 'platform_bed',
    finishes: [
      {
        name: 'Charcoal Nubuck & Smoked Walnut',
        swatchHex: '#2C2825',
        woodHex: '#4A3525',
        fabricHex: '#3B3632',
        accentHex: '#D6A342',
      },
      {
        name: 'Champagne Suede & Espresso Oak',
        swatchHex: '#C8B294',
        woodHex: '#2E2016',
        fabricHex: '#D6C4AA',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 2,
    roomPosition: [-3.4, 0, -5.2],
  },
  {
    id: 'eclipse-nero-gold-dining-table',
    name: 'Eclipse Nero Marquina & 24K Gold Dining Table',
    collectionId: 'dining-tables-chairs',
    collectionLabel: 'Dining Tables',
    roomId: 'dining',
    price: 15400,
    originalPrice: 17900,
    showcaseTiers: ['featured', 'special-offer'],
    dimensions: '300 × 130 × 76 cm',
    materials: 'Polished Nero Marquina Black Marble, Interlocking Brushed Gold Struts',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'An architectural oval black marble tabletop supported by interlocking diagonal brushed gold and Carrara stone structural beams.',
    architecturalStory:
      'Precision-machined in modular components that lock together without visible fasteners for a dramatic kinetic assembly.',
    image: IMG_DINING_DARK,
    secondaryImage: IMG_DECOR,
    modelType: 'travertine_dining',
    finishes: [
      {
        name: 'Nero Marquina Marble & 24K Gold',
        swatchHex: '#1A1817',
        woodHex: '#D6A342',
        fabricHex: '#292522',
        accentHex: '#FFC857',
      },
      {
        name: 'Roman Travertine & Champagne Brass',
        swatchHex: '#D9CBB8',
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
    name: 'Valkyrie Carbon & Cognac Executive Chair',
    collectionId: 'office-chairs',
    collectionLabel: 'Office Chairs',
    roomId: 'dressing',
    price: 5400,
    showcaseTiers: ['featured', 'new-arrival', 'bestseller'],
    dimensions: '68 × 72 × 124 cm',
    materials: 'Sculpted Carbon Fiber Exoskeleton, Quilted Cognac Leather, Cast Gold Spine',
    leadTime: 'In Stock · Express Courier',
    description:
      'A futuristic high-back executive throne combining a sculpted matte carbon fiber outer shell with diamond-quilted cognac leather and an articulated cast-gold spine.',
    architecturalStory:
      'Built for zero-fatigue command in private studies and architectural penthouses.',
    image: IMG_OFFICE_CHAIR,
    secondaryImage: IMG_GOLD_SOFA,
    modelType: 'executive_office_chair',
    finishes: [
      {
        name: 'Cognac Full-Grain Leather & Gold Spine',
        swatchHex: '#9C5A2E',
        woodHex: '#1C1A17',
        fabricHex: '#9C5A2E',
        accentHex: '#D6A342',
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
    name: 'Chronos Illuminated Bronze & Fluted Wardrobe',
    collectionId: 'wardrobes-storage',
    collectionLabel: 'Modern Wardrobes',
    roomId: 'dressing',
    price: 18900,
    originalPrice: 21500,
    showcaseTiers: ['featured', 'special-offer'],
    dimensions: '320 × 64 × 260 cm',
    materials: 'Fluted Smoked Oak, Tinted Bronze Glass, 2700K Golden LED Vitrines',
    leadTime: 'Bespoke Commission · 4 Weeks',
    description:
      'Floor-to-ceiling futuristic wardrobe system with articulated fluted timber doors and smoked bronze glass vitrines that swing open to reveal illuminated couture shelving.',
    architecturalStory:
      'Integrates motion-activated golden light strips along every vertical stave.',
    image: IMG_WARDROBE,
    secondaryImage: IMG_KING_BED,
    modelType: 'fluted_wardrobe',
    finishes: [
      {
        name: 'Smoked Oak & Champagne Gold Vitrine',
        swatchHex: '#735338',
        woodHex: '#5C4028',
        fabricHex: '#E6DEC8',
        accentHex: '#D6A342',
      },
      {
        name: 'Obsidian Ash & Bright Gold',
        swatchHex: '#241F1B',
        woodHex: '#241F1B',
        fabricHex: '#D6A342',
        accentHex: '#FFC857',
      },
    ],
    featuredOrder: 5,
    roomPosition: [3.4, 0, -5.8],
  },
  {
    id: 'quarry-plinth-coffee-table',
    name: 'Monolith Levitating Stone & Gold Plinth Table',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 4950,
    showcaseTiers: ['featured', 'bestseller'],
    dimensions: '140 × 110 × 32 cm',
    materials: 'Honed Travertine & Nero Marble, Recessed 24K Gold Plinth Base',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'A low architectural block of solid natural stone set above a recessed brushed gold light-channel base.',
    architecturalStory:
      'Anchors futuristic lounge environments with geological permanence and warm golden floor reflections.',
    image: IMG_COFFEE,
    secondaryImage: IMG_GOLD_SOFA,
    modelType: 'plinth_coffee_table',
    finishes: [
      {
        name: 'Honed Travertine & 24K Gold Base',
        swatchHex: '#E2D6C1',
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
    name: 'Hyperion Orbital Gold & Velvet Lounge Chair',
    collectionId: 'sofas-living',
    collectionLabel: 'Luxury Sofas',
    roomId: 'living',
    price: 4800,
    originalPrice: 5600,
    showcaseTiers: ['new-arrival', 'special-offer'],
    dimensions: '86 × 90 × 74 cm',
    materials: 'Steam-Bent Smoked Walnut, Champagne Velvet, Brushed Gold Ring Base',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'A low-slung orbital lounge chair cradled by a continuous brushed gold and walnut exoskeleton.',
    architecturalStory:
      'Rotates 360 degrees smoothly on a concealed precision bearing.',
    image: IMG_GOLD_SOFA,
    secondaryImage: IMG_OFFICE_CHAIR,
    modelType: 'sculptural_lounge_chair',
    finishes: [
      {
        name: 'Champagne Velvet & Brushed Gold',
        swatchHex: '#D6C1A3',
        woodHex: '#4A3525',
        fabricHex: '#D6C1A3',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 7,
    roomPosition: [-1.4, 0, 0.7],
  },
  {
    id: 'aurelia-dining-armchair-set',
    name: 'Aurelia Gold-Tipped Espresso Dining Chairs (Pair)',
    collectionId: 'dining-tables-chairs',
    collectionLabel: 'Dining Tables',
    roomId: 'dining',
    price: 3400,
    showcaseTiers: ['bestseller', 'new-arrival'],
    dimensions: '58 × 56 × 79 cm',
    materials: 'Full-Grain Espresso Saddle Leather, Brushed 24K Gold Sabots & Trim',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'Sculpted wrap-around dining chairs featuring gold-piped seams and solid brushed brass leg sabots.',
    architecturalStory:
      'Designed as the companion seating to the Eclipse Nero Marquina Dining Table.',
    image: IMG_DINING_DARK,
    secondaryImage: IMG_GOLD_SOFA,
    modelType: 'curved_dining_chair',
    finishes: [
      {
        name: 'Espresso Leather & 24K Gold Sabots',
        swatchHex: '#2E231C',
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
    name: 'Halo Cantilevered 24K Gold & Walnut Side Table',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 2350,
    originalPrice: 2800,
    showcaseTiers: ['special-offer', 'bestseller'],
    dimensions: 'Ø 48 × 54 cm',
    materials: 'Hand-Brushed 24K Champagne Brass, Solid Smoked American Walnut Top',
    leadTime: 'In Stock · Express Courier',
    description:
      'An architectural C-profile side table with a curved brushed gold spine and open ring base.',
    architecturalStory:
      'Slides effortlessly over sofa plinths to keep beverages and smart controls within reach.',
    image: IMG_COFFEE,
    secondaryImage: IMG_DECOR,
    modelType: 'brass_side_table',
    finishes: [
      {
        name: 'Brushed 24K Gold & Smoked Walnut',
        swatchHex: '#D6A342',
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
    name: 'Horizon Gold-Inlaid Floating Nightstands (Pair)',
    collectionId: 'modern-bedroom',
    collectionLabel: 'King-Size Beds',
    roomId: 'bedroom',
    price: 3800,
    showcaseTiers: ['new-arrival'],
    dimensions: '64 × 46 × 38 cm (Each)',
    materials: 'Smoked American Walnut, Brushed Gold Drawer Channels, Suede Lining',
    leadTime: 'In Stock · White-Glove Delivery',
    description:
      'Cantilevered bedside modules with recessed golden LED underglow and mitered waterfall joinery.',
    architecturalStory:
      'Suspends beside the Apex King Bed for a seamless zero-gravity horizon.',
    image: IMG_KING_BED,
    secondaryImage: IMG_DECOR,
    modelType: 'floating_nightstand',
    finishes: [
      {
        name: 'Smoked Walnut & Brushed Gold',
        swatchHex: '#5C4028',
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
    name: 'Vanguard Fluted Bronze & Marble Credenza',
    collectionId: 'wardrobes-storage',
    collectionLabel: 'Modern Wardrobes',
    roomId: 'dressing',
    price: 8400,
    showcaseTiers: ['new-arrival'],
    dimensions: '220 × 50 × 76 cm',
    materials: 'Fluted Dark Oak Doors, Nero Marquina Top Slab, Brushed Gold Base',
    leadTime: 'Made to order · 3 Weeks',
    description:
      'A low-profile architectural credenza combining rhythmic fluted timber doors with a polished black and gold marble gallery top.',
    architecturalStory:
      'Anchors executive suites and private cinema salons.',
    image: IMG_WARDROBE,
    secondaryImage: IMG_DINING_DARK,
    modelType: 'limestone_credenza',
    finishes: [
      {
        name: 'Fluted Smoked Oak & Gold Base',
        swatchHex: '#6E5036',
        woodHex: '#5C4028',
        fabricHex: '#292522',
        accentHex: '#D6A342',
      },
    ],
    featuredOrder: 11,
    roomPosition: [4.6, 0, -4.8],
  },
  {
    id: 'solis-travertine-vessel-trio',
    name: 'Aether Gold Halo Lamp & Sculptural Vessels',
    collectionId: 'designer-furniture',
    collectionLabel: 'Designer Furniture',
    roomId: 'living',
    price: 1950,
    originalPrice: 2400,
    showcaseTiers: ['new-arrival', 'special-offer'],
    dimensions: 'Lamp H 58 cm · Vessels H 24–42 cm',
    materials: 'Turned Travertine, Hammered 24K Gold Tray, Warm Diffused Shade',
    leadTime: 'In Stock · Express Courier',
    description:
      'An art-directed ensemble pairing a turned stone column lamp and warm golden diffuser with three sculptural vessels on a hammered gold tray.',
    architecturalStory:
      'Casts a warm cinematic golden halo across dark marble and walnut surfaces.',
    image: IMG_DECOR,
    secondaryImage: IMG_COFFEE,
    modelType: 'ceramic_vessels',
    finishes: [
      {
        name: 'Travertine Stone & 24K Gold Tray',
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
