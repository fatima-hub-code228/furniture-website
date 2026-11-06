import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  X,
  RotateCw,
  ShoppingBag,
  Heart,
  Check,
  Sparkles,
  MoveHorizontal,
  ZoomIn,
  ZoomOut,
  Minus,
  Plus,
} from 'lucide-react';
import { FurnitureProduct } from '../data/catalog';
import {
  buildProceduralFurnitureGroup,
  createShowroomPedestalGroup,
} from '../three/proceduralFurniture';

interface FloatingProductModal3DProps {
  product: FurnitureProduct | null;
  onClose: () => void;
  onAddToCart: (product: FurnitureProduct, finishName: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const FloatingProductModal3D: React.FC<FloatingProductModal3DProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedFinishIdx, setSelectedFinishIdx] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(28);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'photo1' | 'photo2'>('3d');

  const requestRenderRef = useRef<() => void>(() => {});
  const rotationRadRef = useRef((28 * Math.PI) / 180);
  const zoomFactorRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    setSelectedFinishIdx(0);
    setRotationAngle(28);
    setZoomPercent(100);
    setQuantity(1);
    setActiveMediaTab('3d');
    rotationRadRef.current = (28 * Math.PI) / 180;
    zoomFactorRef.current = 1.0;
  }, [product?.id]);

  useEffect(() => {
    rotationRadRef.current = (rotationAngle * Math.PI) / 180;
    requestRenderRef.current();
  }, [rotationAngle]);

  useEffect(() => {
    zoomFactorRef.current = 100 / Math.max(50, Math.min(160, zoomPercent));
    requestRenderRef.current();
  }, [zoomPercent]);

  useEffect(() => {
    if (!product) return;
    const container = canvasWrapperRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 280);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080808');

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    const baseCameraPos = new THREE.Vector3(0, 2.1, 4.5);
    camera.position.copy(baseCameraPos);
    camera.lookAt(0, 0.55, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.72;

    const hemi = new THREE.HemisphereLight('#FFF3D6', '#17120D', 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight('#FFE5B4', 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const goldRimLight = new THREE.PointLight('#FFC857', 2.6, 12);
    goldRimLight.position.set(-3, 3.2, -2.5);
    scene.add(goldRimLight);

    // Glossy Black Marble Pedestal + Rotating Golden Energy Rings
    const { pedestalGroup, outerEnergyRing, innerEnergyRing } = createShowroomPedestalGroup(
      1.85,
      true
    );
    scene.add(pedestalGroup);

    const activeFinish = product.finishes[selectedFinishIdx] || product.finishes[0];
    const furnitureGroup = buildProceduralFurnitureGroup(product.modelType, activeFinish, false);
    furnitureGroup.position.y = 0.06;
    scene.add(furnitureGroup);

    let rafId = 0;
    let dirty = false;

    const draw = () => {
      rafId = 0;
      dirty = false;

      const rot = rotationRadRef.current;
      furnitureGroup.rotation.y = rot;

      outerEnergyRing.rotation.z = rot * 1.3;
      innerEnergyRing.rotation.y = -rot * 1.1;

      const zFactor = zoomFactorRef.current;
      camera.position.set(
        baseCameraPos.x * zFactor,
        baseCameraPos.y * (0.85 + 0.15 * zFactor),
        baseCameraPos.z * zFactor
      );
      camera.lookAt(0, 0.55, 0);

      renderer.render(scene, camera);
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
  }, [product, selectedFinishIdx]);

  if (!product) return null;

  const activeFinish = product.finishes[selectedFinishIdx] || product.finishes[0];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setRotationAngle((prev) => (prev + Math.round(dx * 0.85) + 360) % 360);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 10 : -10;
    setZoomPercent((prev) => Math.max(60, Math.min(150, prev + delta)));
  };

  const handleSpin360 = () => {
    setActiveMediaTab('3d');
    let step = 0;
    const startAngle = rotationAngle;
    const totalSteps = 20;
    const timer = window.setInterval(() => {
      step++;
      setRotationAngle((startAngle + Math.round((step / totalSteps) * 360)) % 360);
      if (step >= totalSteps) window.clearInterval(timer);
    }, 22);
  };

  const handleAdd = () => {
    onAddToCart(product, activeFinish.name, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-3d-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-[#080808]/90 backdrop-blur-md"
    >
      <div className="relative w-full max-w-6xl bg-[#17120D] border border-[#D6A342]/45 shadow-[0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[94vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close 3D Inspector"
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-[#080808]/90 hover:bg-[#D6A342] text-white hover:text-[#080808] border border-[#D6A342]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive 360° 3D Stage + Uploaded Showroom Photography Switcher */}
        <div className="lg:col-span-7 relative bg-[#080808] flex flex-col justify-between min-h-[380px] lg:min-h-[600px] border-b lg:border-b-0 lg:border-r border-[#D6A342]/30">
          {/* Top Stage Header */}
          <div className="relative z-20 p-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveMediaTab('3d')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-mono uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                  activeMediaTab === '3d'
                    ? 'bg-[#D6A342] text-[#080808] border-[#FFC857] font-bold'
                    : 'bg-[#17120D]/90 text-[#FFC857] border-[#D6A342]/40 hover:border-[#FFC857]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                360° 3D Stage
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('photo1')}
                className={`px-3 py-1.5 border text-[11px] font-mono uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                  activeMediaTab === 'photo1'
                    ? 'bg-[#D6A342] text-[#080808] border-[#FFC857] font-bold'
                    : 'bg-[#17120D]/90 text-[#D8CFC2] border-[#D6A342]/40 hover:border-[#FFC857]'
                }`}
              >
                Showroom Photo 01
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('photo2')}
                className={`px-3 py-1.5 border text-[11px] font-mono uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                  activeMediaTab === 'photo2'
                    ? 'bg-[#D6A342] text-[#080808] border-[#FFC857] font-bold'
                    : 'bg-[#17120D]/90 text-[#D8CFC2] border-[#D6A342]/40 hover:border-[#FFC857]'
                }`}
              >
                Interior View 02
              </button>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.max(60, z - 15))}
                aria-label="Zoom Out 3D Model"
                className="p-2 bg-[#17120D] text-[#D8CFC2] hover:text-[#FFC857] border border-[#D6A342]/35 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-1 bg-[#17120D] border border-[#D6A342]/35 text-[11px] font-mono text-[#FFC857]">
                {zoomPercent}%
              </span>
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.min(150, z + 15))}
                aria-label="Zoom In 3D Model"
                className="p-2 bg-[#17120D] text-[#D8CFC2] hover:text-[#FFC857] border border-[#D6A342]/35 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSpin360}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D6A342] text-[#080808] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#FFC857] transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                360° Spin
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas */}
          <div
            ref={canvasWrapperRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheelZoom}
            data-testid="modal-3d-stage"
            className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none transition-opacity duration-300 ${
              activeMediaTab === '3d' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          />

          {/* High-Resolution Uploaded Furniture Photo Overlay when Photo tab active */}
          {activeMediaTab !== '3d' && (
            <div className="absolute inset-0 z-10 overflow-hidden bg-[#080808] flex items-center justify-center p-6">
              <img
                src={activeMediaTab === 'photo1' ? product.image : product.secondaryImage}
                alt={product.name}
                style={{ objectPosition: product.imagePosition || 'center center' }}
                className="w-full h-full object-cover border border-[#D6A342]/40 transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-6 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Bottom 360° Rotation & Zoom Controls */}
          <div className="relative z-20 p-5 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#D8CFC2] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#FFC857]" />
                  360° ORBIT ROTATION
                </span>
                <span className="text-[#FFC857]">{rotationAngle}°</span>
              </div>
              <input
                type="range"
                aria-label="Rotate 3D Model Angle"
                min={0}
                max={360}
                value={rotationAngle}
                onChange={(e) => setRotationAngle(parseInt(e.target.value, 10))}
                className="w-full accent-[#D6A342] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#D8CFC2] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#FFC857]" />
                  CAMERA ZOOM
                </span>
                <span className="text-[#FFC857]">{zoomPercent}%</span>
              </div>
              <input
                type="range"
                aria-label="Zoom 3D Model"
                min={60}
                max={150}
                step={5}
                value={zoomPercent}
                onChange={(e) => setZoomPercent(parseInt(e.target.value, 10))}
                className="w-full accent-[#FFC857] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dark-Luxury Product Specification & Customization */}
        <div className="lg:col-span-5 p-6 md:p-8 overflow-y-auto flex flex-col justify-between bg-[#17120D] text-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FFC857] mb-2">
              <span>{product.collectionLabel}</span>
              <span>•</span>
              <span>{product.leadTime}</span>
            </div>

            <h2
              id="modal-3d-product-title"
              className="text-3xl md:text-4xl font-serif text-white mb-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {product.name}
            </h2>

            <p className="text-sm text-[#C8B99E] mb-4">{product.architecturalStory}</p>

            <div className="flex items-baseline gap-3 pb-5 mb-5 border-b border-[#D6A342]/25">
              <span className="text-2xl font-mono font-semibold text-[#FFC857]">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm font-mono text-[#8E7F68] line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-mono text-[#C8B99E]">
                • White-glove architectural installation
              </span>
            </div>

            <p className="text-sm text-[#D8CFC2] leading-relaxed mb-6">{product.description}</p>

            {/* Color / Finish Swatches */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-[0.18em] text-[#FFC857] mb-2.5">
                Bespoke Upholstery &amp; Finish:{' '}
                <strong className="text-white">{activeFinish.name}</strong>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {product.finishes.map((finish, idx) => {
                  const active = idx === selectedFinishIdx;
                  return (
                    <button
                      key={finish.name}
                      type="button"
                      onClick={() => setSelectedFinishIdx(idx)}
                      aria-label={`Select color ${finish.name}`}
                      className={`group flex items-center gap-2 px-3 py-2 border text-xs transition-all cursor-pointer ${
                        active
                          ? 'border-[#FFC857] bg-[#080808] text-[#FFC857] font-medium shadow-[0_0_12px_rgba(255,200,87,0.25)]'
                          : 'border-[#D6A342]/30 bg-[#080808]/50 text-[#D8CFC2] hover:border-[#D6A342]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: finish.swatchHex }}
                      />
                      <span>{finish.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architectural Specifications */}
            <div className="bg-[#080808] border border-[#D6A342]/30 p-4 mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="font-mono uppercase tracking-wider text-[#C8B99E]">
                  Dimensions
                </span>
                <span className="font-mono text-white text-right">{product.dimensions}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-mono uppercase tracking-wider text-[#C8B99E]">
                  Materials
                </span>
                <span className="text-[#D8CFC2] text-right">{product.materials}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-mono uppercase tracking-wider text-[#C8B99E]">
                  Availability
                </span>
                <span className="text-[#FFC857] font-mono">{product.leadTime}</span>
              </div>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2 border-t border-[#D6A342]/25">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C8B99E]">
                Quantity
              </span>
              <div className="inline-flex items-center border border-[#D6A342]/40 bg-[#080808]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-2 text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Showroom Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag — ${(product.price * quantity).toLocaleString()}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label="Toggle Wishlist"
                className={`p-3.5 border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#FFC857] bg-[#D6A342]/20 text-[#FFC857]'
                    : 'border-[#D6A342]/40 bg-[#080808] text-[#D8CFC2] hover:border-[#FFC857]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FFC857]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
