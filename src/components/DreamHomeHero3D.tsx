import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  Wand2,
  Eye,
  RotateCw,
  ArrowRight,
  Compass,
} from 'lucide-react';
import {
  RoomId,
  ROOM_ZONES,
  computeRoomFurnishState,
  PRODUCTS,
  FurnitureProduct,
} from '../data/catalog';
import {
  detectSoftwareWebGL,
  buildProceduralFurnitureGroup,
  createShowroomPedestalGroup,
  getBlackMarbleTexture,
} from '../three/proceduralFurniture';

interface DreamHomeHero3DProps {
  activeZone: RoomId;
  onSelectZone: (zone: RoomId) => void;
  furnishProgress: number;
  onChangeFurnishProgress: (progress: number) => void;
  onInspectProduct: (product: FurnitureProduct) => void;
  onExploreShowroom: () => void;
}

interface RoomPlacement {
  productId: string;
  targetPos: [number, number, number];
  rotationY: number;
  scale: number;
  pedestalRadius: number;
  includeRings: boolean;
}

const ROOM_PLACEMENTS: RoomPlacement[] = [
  // Hero Sofa Vault (Left-Front focal pedestal)
  {
    productId: 'sovereign-orbital-sofa',
    targetPos: [-2.6, 0, 0.2],
    rotationY: 0.32,
    scale: 1.08,
    pedestalRadius: 2.15,
    includeRings: true,
  },
  {
    productId: 'quarry-plinth-coffee-table',
    targetPos: [-2.4, 0, 2.3],
    rotationY: 0.12,
    scale: 0.94,
    pedestalRadius: 1.25,
    includeRings: false,
  },
  // Imperial Dining Rotunda (Right-Front focal pedestal)
  {
    productId: 'eclipse-nero-gold-dining-table',
    targetPos: [3.8, 0, 0.2],
    rotationY: -0.35,
    scale: 1.02,
    pedestalRadius: 2.1,
    includeRings: true,
  },
  // Apex King Suite Stage (Left-Back focal pedestal)
  {
    productId: 'apex-cantilever-king-bed',
    targetPos: [-2.6, 0, -5.2],
    rotationY: 0.15,
    scale: 0.98,
    pedestalRadius: 2.25,
    includeRings: true,
  },
  // Executive & Atelier Wing (Right-Back focal pedestals)
  {
    productId: 'atelier-fluted-oak-wardrobe',
    targetPos: [4.2, 0, -5.6],
    rotationY: -0.25,
    scale: 0.94,
    pedestalRadius: 1.65,
    includeRings: false,
  },
  {
    productId: 'valkyrie-carbon-gold-office-chair',
    targetPos: [2.2, 0, -4.4],
    rotationY: -0.55,
    scale: 1.05,
    pedestalRadius: 1.25,
    includeRings: true,
  },
];

const SHOWROOM_PEDESTAL_PRODUCTS: string[] = [
  'sovereign-orbital-sofa',
  'apex-cantilever-king-bed',
  'eclipse-nero-gold-dining-table',
  'atelier-fluted-oak-wardrobe',
  'valkyrie-carbon-gold-office-chair',
  'quarry-plinth-coffee-table',
];

export const DreamHomeHero3D: React.FC<DreamHomeHero3DProps> = ({
  activeZone,
  onSelectZone,
  furnishProgress,
  onChangeFurnishProgress,
  onInspectProduct,
  onExploreShowroom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<'golden' | 'nocturnal'>('golden');
  const [dockExpanded, setDockExpanded] = useState(false);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const [heroRotationDeg, setHeroRotationDeg] = useState<number>(28);
  const [beamSweepKey, setBeamSweepKey] = useState<number>(1);
  const [focusedProductId, setFocusedProductId] = useState<string>('sovereign-orbital-sofa');

  const requestRenderRef = useRef<() => void>(() => {});
  const cameraTargetRef = useRef<{ pos: THREE.Vector3; lookAt: THREE.Vector3 }>({
    pos: new THREE.Vector3(...ROOM_ZONES[0].cameraPos),
    lookAt: new THREE.Vector3(...ROOM_ZONES[0].cameraTarget),
  });
  const currentCameraRef = useRef<{ pos: THREE.Vector3; lookAt: THREE.Vector3 }>({
    pos: new THREE.Vector3(-7.2, 4.1, 8.8),
    lookAt: new THREE.Vector3(-2.6, 0.65, 0.2),
  });
  const furnishProgressRef = useRef(furnishProgress);
  const lightingModeRef = useRef(lightingMode);
  const heroRotationRadRef = useRef((heroRotationDeg * Math.PI) / 180);

  useEffect(() => {
    furnishProgressRef.current = furnishProgress;
    requestRenderRef.current();
  }, [furnishProgress]);

  useEffect(() => {
    lightingModeRef.current = lightingMode;
    requestRenderRef.current();
  }, [lightingMode]);

  useEffect(() => {
    heroRotationRadRef.current = (heroRotationDeg * Math.PI) / 180;
    requestRenderRef.current();
  }, [heroRotationDeg]);

  useEffect(() => {
    const zone = ROOM_ZONES.find((z) => z.id === activeZone) || ROOM_ZONES[0];
    cameraTargetRef.current.pos.set(...zone.cameraPos);
    cameraTargetRef.current.lookAt.set(...zone.cameraTarget);
    setBeamSweepKey((prev) => prev + 1);

    if (activeZone === 'living') setFocusedProductId('sovereign-orbital-sofa');
    else if (activeZone === 'bedroom') setFocusedProductId('apex-cantilever-king-bed');
    else if (activeZone === 'dining') setFocusedProductId('eclipse-nero-gold-dining-table');
    else if (activeZone === 'dressing') setFocusedProductId('valkyrie-carbon-gold-office-chair');

    let step = 0;
    const totalSteps = 20;
    const interval = window.setInterval(() => {
      step++;
      currentCameraRef.current.pos.lerp(cameraTargetRef.current.pos, 0.25);
      currentCameraRef.current.lookAt.lerp(cameraTargetRef.current.lookAt, 0.25);
      requestRenderRef.current();
      if (step >= totalSteps) {
        currentCameraRef.current.pos.copy(cameraTargetRef.current.pos);
        currentCameraRef.current.lookAt.copy(cameraTargetRef.current.lookAt);
        requestRenderRef.current();
        window.clearInterval(interval);
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [activeZone]);

  // Initial dramatic entrance sweep & 360° turn on mount
  useEffect(() => {
    let step = 0;
    const totalSteps = 26;
    const timer = window.setInterval(() => {
      step++;
      const t = step / totalSteps;
      const eased = 1 - Math.pow(1 - t, 3);
      setHeroRotationDeg(Math.round(eased * 360));
      currentCameraRef.current.pos.lerp(cameraTargetRef.current.pos, 0.2);
      currentCameraRef.current.lookAt.lerp(cameraTargetRef.current.lookAt, 0.2);
      requestRenderRef.current();
      if (step >= totalSteps) {
        window.clearInterval(timer);
      }
    }, 22);
    return () => window.clearInterval(timer);
  }, []);

  // Setup Three.js Futuristic Dark-Gold Showroom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoft = detectSoftwareWebGL();
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080808');
    scene.fog = new THREE.FogExp2('#080808', 0.025);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.copy(currentCameraRef.current.pos);
    camera.lookAt(currentCameraRef.current.lookAt);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoft,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoft ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoft;
    if (!isSoft) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.68;

    // Futuristic Black Marble Showroom Architecture
    const architectureGroup = new THREE.Group();
    const blackMarbleMat = new THREE.MeshStandardMaterial({
      color: '#12100E',
      map: getBlackMarbleTexture(),
      roughness: 0.18,
      metalness: 0.35,
    });
    const obsidianWallMat = new THREE.MeshStandardMaterial({
      color: '#0D0B09',
      roughness: 0.42,
      metalness: 0.25,
    });
    const goldStripMat = new THREE.MeshStandardMaterial({
      color: '#FFC857',
      emissive: new THREE.Color('#D6A342'),
      emissiveIntensity: 1.15,
      roughness: 0.2,
      metalness: 0.85,
    });
    const brassColMat = new THREE.MeshStandardMaterial({
      color: '#D6A342',
      roughness: 0.18,
      metalness: 0.88,
    });

    // Reflective Black Marble Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 28), blackMarbleMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    architectureGroup.add(floor);

    // Embedded Golden Light Strips in the Floor Grid
    for (let z = -8; z <= 6; z += 3.5) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(24, 0.012, 0.045), goldStripMat);
      strip.position.set(0, 0.006, z);
      architectureGroup.add(strip);
    }
    for (let x = -8; x <= 8; x += 4) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 22), goldStripMat);
      strip.position.set(x, 0.006, -2);
      architectureGroup.add(strip);
    }

    // Back Obsidian Architectural Wall + Golden Light Columns
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(26, 6.5, 0.4), obsidianWallMat);
    backWall.position.set(0, 3.25, -8.5);
    architectureGroup.add(backWall);

    for (let i = -3; i <= 3; i++) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.18, 6.2, 0.48), brassColMat);
      col.position.set(i * 3.4, 3.1, -8.25);
      architectureGroup.add(col);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 5.8, 0.52), goldStripMat);
      led.position.set(i * 3.4, 3.1, -8.22);
      architectureGroup.add(led);
    }

    scene.add(architectureGroup);

    // Showroom Lighting Rig
    const hemiLight = new THREE.HemisphereLight('#FFF3D6', '#17120D', 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFE5B4', 2.4);
    keyLight.position.set(6, 11, 8);
    scene.add(keyLight);

    const goldSpotHero = new THREE.PointLight('#FFC857', 2.8, 14);
    goldSpotHero.position.set(-2.6, 4.4, 0.2);
    scene.add(goldSpotHero);

    const goldSpotDining = new THREE.PointLight('#FFC857', 2.5, 14);
    goldSpotDining.position.set(3.8, 4.4, 0.2);
    scene.add(goldSpotDining);

    // Spawn 3D Furniture Items + Circular Display Platforms + Golden Energy Rings
    const placedItems: Array<{
      placement: RoomPlacement;
      group: THREE.Group;
      pedestalBundle: ReturnType<typeof createShowroomPedestalGroup> | null;
      product: FurnitureProduct;
    }> = [];

    ROOM_PLACEMENTS.forEach((placement) => {
      const product = PRODUCTS.find((p) => p.id === placement.productId);
      if (!product) return;

      let pedestalBundle: ReturnType<typeof createShowroomPedestalGroup> | null = null;
      if (placement.pedestalRadius > 0) {
        pedestalBundle = createShowroomPedestalGroup(
          placement.pedestalRadius,
          placement.includeRings
        );
        pedestalBundle.pedestalGroup.position.set(
          placement.targetPos[0],
          0,
          placement.targetPos[2]
        );
        scene.add(pedestalBundle.pedestalGroup);
      }

      const group = buildProceduralFurnitureGroup(
        product.modelType,
        product.finishes[0],
        !isSoft
      );
      group.position.set(...placement.targetPos);
      group.rotation.y = placement.rotationY;
      group.scale.setScalar(placement.scale);
      scene.add(group);

      placedItems.push({ placement, group, pedestalBundle, product });
    });

    // Coalesced On-Demand Render Loop
    let rafId = 0;
    let dirty = false;

    const afterDraw = () => {
      const gl = renderer.getContext();
      if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        if (sync) gl.deleteSync(sync);
      } else if (gl) {
        gl.flush();
      }
    };

    const draw = () => {
      rafId = 0;
      dirty = false;

      camera.position.copy(currentCameraRef.current.pos);
      camera.lookAt(currentCameraRef.current.lookAt);

      const mode = lightingModeRef.current;
      if (mode === 'golden') {
        keyLight.intensity = 2.4;
        keyLight.color.set('#FFE5B4');
        hemiLight.intensity = 0.72;
        goldSpotHero.intensity = 2.8;
        goldSpotDining.intensity = 2.5;
      } else {
        keyLight.intensity = 1.25;
        keyLight.color.set('#D6A342');
        hemiLight.intensity = 0.38;
        goldSpotHero.intensity = 3.5;
        goldSpotDining.intensity = 3.2;
      }

      const heroRot = heroRotationRadRef.current;

      placedItems.forEach((item, idx) => {
        const state = computeRoomFurnishState(
          furnishProgressRef.current,
          idx,
          placedItems.length
        );

        const s = item.placement.scale * state.scale;
        item.group.scale.setScalar(s);
        item.group.visible = state.opacity > 0.02;

        item.group.position.y =
          item.placement.targetPos[1] + 0.06 + state.elevationY;

        // Rotate furniture & orbital energy rings with hero 360° angle
        item.group.rotation.y =
          item.placement.rotationY + heroRot + (1 - state.localProgress) * 0.5;

        if (item.pedestalBundle) {
          item.pedestalBundle.outerEnergyRing.rotation.z = heroRot * 1.4;
          item.pedestalBundle.innerEnergyRing.rotation.y = -heroRot * 1.2;
        }
      });

      renderer.render(scene, camera);
      afterDraw();
    };

    const requestRender = () => {
      if (dirty) return;
      dirty = true;
      rafId = requestAnimationFrame(draw);
    };

    requestRenderRef.current = requestRender;
    requestRender();

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width === 0 || rect.height === 0) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
      requestRender();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const handleAnimateFurnishing = () => {
    if (isAutoAnimating) return;
    setIsAutoAnimating(true);
    setBeamSweepKey((prev) => prev + 1);
    const startVal = furnishProgress >= 0.95 ? 0 : furnishProgress;
    let step = 0;
    const totalSteps = 26;
    const timer = window.setInterval(() => {
      step++;
      const t = step / totalSteps;
      const nextProgress = startVal + (1 - startVal) * t;
      onChangeFurnishProgress(Number(nextProgress.toFixed(2)));
      setHeroRotationDeg((prev) => (prev + 14) % 360);
      if (step >= totalSteps) {
        onChangeFurnishProgress(1);
        setIsAutoAnimating(false);
        window.clearInterval(timer);
      }
    }, 28);
  };

  const handleSpin360 = () => {
    setBeamSweepKey((prev) => prev + 1);
    let step = 0;
    const startDeg = heroRotationDeg;
    const totalSteps = 24;
    const timer = window.setInterval(() => {
      step++;
      const t = step / totalSteps;
      const eased = 1 - Math.pow(1 - t, 3);
      setHeroRotationDeg(Math.round(startDeg + eased * 360) % 360);
      if (step >= totalSteps) {
        window.clearInterval(timer);
      }
    }, 22);
  };

  const focusedProduct =
    PRODUCTS.find((p) => p.id === focusedProductId) || PRODUCTS[0];

  return (
    <section
      aria-label="DREAMHOME Cinematic 3D Luxury Showroom"
      className="relative w-full h-[88vh] min-h-[640px] max-h-[960px] overflow-hidden bg-[#080808] select-none border-b border-[#D6A342]/25"
    >
      {/* Interactive 3D WebGL Showroom Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0"
        data-testid="dream-home-3d-canvas"
      />

      {/* Cinematic Golden Light Beam Sweep Overlay */}
      <div
        key={beamSweepKey}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        <div className="animate-golden-beam absolute -top-1/4 left-0 w-1/2 h-[150%] bg-gradient-to-r from-transparent via-[#FFC857]/25 to-transparent blur-2xl" />
      </div>

      {/* Subtle Vignette framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#080808]/90 via-[#080808]/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/50"
      />

      {/* Left-Aligned Cinematic Hero Narrative & Action CTA */}
      <div className="relative z-20 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-between py-8 md:py-10 pointer-events-none">
        {/* Top Stage Telemetry & Showroom Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-[#17120D]/90 backdrop-blur-md border border-[#D6A342]/40">
            <span className="w-2 h-2 rounded-full bg-[#FFC857] shadow-[0_0_10px_#FFC857]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FFC857]">
              3D HOLOGRAPHIC SHOWROOM • 360° ORBITAL STAGE
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 bg-[#17120D]/90 backdrop-blur-md p-1.5 border border-[#D6A342]/35">
            <button
              type="button"
              onClick={handleSpin360}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#D6A342]/20 text-[#FFC857] border border-[#D6A342]/50 hover:bg-[#D6A342] hover:text-[#080808] transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              360° Orbit ({heroRotationDeg}°)
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('golden')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                lightingMode === 'golden'
                  ? 'bg-[#D6A342] text-[#080808] font-semibold'
                  : 'text-[#C8B99E] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Golden Spotlight
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('nocturnal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                lightingMode === 'nocturnal'
                  ? 'bg-[#D6A342] text-[#080808] font-semibold'
                  : 'text-[#C8B99E] hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Obsidian Noir
            </button>
          </div>
        </div>

        {/* Center-Left DREAMHOME Title Block */}
        <div className="max-w-xl my-auto pointer-events-auto bg-[#080808]/75 backdrop-blur-md p-6 md:p-8 border-l-2 border-[#D6A342] shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          <p className="text-xs font-mono uppercase tracking-[0.32em] text-[#FFC857] mb-2">
            &ldquo;ENTER THE WORLD OF LUXURY&rdquo;
          </p>
          <h1
            className="text-4xl sm:text-6xl font-serif tracking-[0.14em] text-white leading-[1.04] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            DREAMHOME
          </h1>
          <p className="text-sm md:text-base text-[#D8CFC2] leading-relaxed mb-6">
            Experience architectural 3D furniture suspended on obsidian marble pedestals with
            rotating golden energy rings. Rotate every silhouette 360°, customize materials in real
            time, and command cinematic room transformations.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreShowroom}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs uppercase tracking-[0.22em] font-bold hover:brightness-110 transition-all cursor-pointer shadow-[0_0_25px_rgba(214,163,66,0.45)]"
            >
              <span>EXPLORE THE SHOWROOM</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onInspectProduct(focusedProduct)}
              className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#17120D]/90 text-white border border-[#D6A342]/50 text-xs uppercase tracking-[0.16em] font-medium hover:border-[#FFC857] hover:text-[#FFC857] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#FFC857]" />
              Inspect {focusedProduct.name.split(' ')[0]} in 3D
            </button>
          </div>

          {/* Interactive Circular Pedestal Selector Pills */}
          <div className="mt-6 pt-5 border-t border-[#D6A342]/25">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-[#C8B99E] mb-2.5">
              <span>ACTIVE SHOWROOM PEDESTALS</span>
              <span className="text-[#FFC857]">CLICK TO INSPECT 360°</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SHOWROOM_PEDESTAL_PRODUCTS.map((pid) => {
                const prod = PRODUCTS.find((p) => p.id === pid);
                if (!prod) return null;
                const isSelected = focusedProductId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setFocusedProductId(prod.id);
                      onInspectProduct(prod);
                    }}
                    className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D6A342]/25 border-[#FFC857] text-[#FFC857]'
                        : 'bg-[#17120D]/80 border-[#D6A342]/30 text-[#D8CFC2] hover:border-[#D6A342]'
                    }`}
                  >
                    {prod.collectionLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Dock: Camera Zones + Room Furnishing & 360° Controls */}
        <div className="pointer-events-auto w-full max-w-4xl mx-auto">
          <div className="bg-[#17120D]/95 backdrop-blur-md border border-[#D6A342]/40 p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Camera Zone Switcher */}
              <div
                className="flex flex-wrap items-center gap-1.5"
                role="tablist"
                aria-label="Showroom Camera Angles"
              >
                {ROOM_ZONES.map((zone) => {
                  const active = activeZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onSelectZone(zone.id)}
                      className={`px-3.5 py-2 text-xs font-medium tracking-wider uppercase transition-all cursor-pointer ${
                        active
                          ? 'bg-[#D6A342] text-[#080808] font-bold shadow-[0_0_15px_rgba(214,163,66,0.4)]'
                          : 'bg-[#080808]/60 text-[#D8CFC2] border border-[#D6A342]/25 hover:border-[#D6A342]'
                      }`}
                    >
                      {zone.name}
                    </button>
                  );
                })}
              </div>

              {/* Quick Stage Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAnimateFurnishing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider bg-[#080808] text-[#FFC857] border border-[#D6A342]/50 hover:bg-[#D6A342] hover:text-[#080808] transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Stage Transition ({Math.round(furnishProgress * 100)}%)
                </button>
                <button
                  type="button"
                  onClick={() => setDockExpanded((v) => !v)}
                  aria-expanded={dockExpanded}
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-mono text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#D6A342]" />
                  <span>{dockExpanded ? 'Hide Controls' : '360° & Stage Controls'}</span>
                  {dockExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {dockExpanded && (
              <div className="mt-3 pt-3 border-t border-[#D6A342]/25 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex justify-between text-xs font-mono text-[#D8CFC2] mb-1">
                    <span>SHOWROOM ASSEMBLY STAGE</span>
                    <span className="text-[#FFC857]">
                      {Math.round(furnishProgress * 100)}% FURNISHED
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label="Room Furnishing Progress"
                    min={0}
                    max={1}
                    step={0.05}
                    value={furnishProgress}
                    onChange={(e) => onChangeFurnishProgress(parseFloat(e.target.value))}
                    className="w-full accent-[#D6A342] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-[#D8CFC2] mb-1">
                    <span>360° TURNTABLE ROTATION</span>
                    <span className="text-[#FFC857]">{heroRotationDeg}°</span>
                  </div>
                  <input
                    type="range"
                    aria-label="360 Degree Turntable Rotation"
                    min={0}
                    max={360}
                    step={1}
                    value={heroRotationDeg}
                    onChange={(e) => setHeroRotationDeg(parseInt(e.target.value, 10))}
                    className="w-full accent-[#FFC857] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
