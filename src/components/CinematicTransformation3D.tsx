import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Layers, Sparkles, Sliders } from 'lucide-react';
import {
  TransformationMode,
  FurnitureModelType,
  computeTransformationStage,
} from '../data/catalog';
import {
  detectSoftwareWebGL,
  createShowroomPedestalGroup,
  buildProceduralFurnitureGroup,
  applyKineticTransformationToGroup,
} from '../three/proceduralFurniture';

const TRANSFORMATION_MODES: {
  id: TransformationMode;
  label: string;
  subtitle: string;
  modelType: FurnitureModelType;
  description: string;
}[] = [
  {
    id: 'dining-assembly',
    label: '01. Dining Table Assembly',
    subtitle: 'Modular Nero Marquina & 24K Gold Lock-In',
    modelType: 'travertine_dining',
    description:
      'Watch separate floating marble columns, brushed gold collars, interlocking structural beams, and the oval tabletop assemble with millimeter precision.',
  },
  {
    id: 'wardrobe-open',
    label: '02. Wardrobe Interior Reveal',
    subtitle: '108° Articulated Doors & 2700K Vitrine',
    modelType: 'fluted_wardrobe',
    description:
      'Twin fluted smoked-oak doors swing open on concealed pivots to reveal warm-illuminated couture shelving and bronze glass compartments.',
  },
  {
    id: 'bed-furnish',
    label: '03. King Bed Transformation',
    subtitle: 'Architectural Frame to Full Luxury Suite',
    modelType: 'platform_bed',
    description:
      'Transforms stage-by-stage from a cantilevered walnut and gold chassis into a complete king-size sanctuary with channeled nubuck headboard and silk bolsters.',
  },
  {
    id: 'sofa-orbital',
    label: '04. Sofa 360° Orbital Reveal',
    subtitle: 'Zero-Gravity Rotation & Golden Energy Rings',
    modelType: 'curved_sofa',
    description:
      'Completes a continuous 360-degree orbital rotation suspended above a glossy black marble platform while dual golden energy rings counter-rotate.',
  },
];

export const CinematicTransformation3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<TransformationMode>('dining-assembly');
  const [progress, setProgress] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeModeRef = useRef<TransformationMode>(activeMode);
  const progressRef = useRef<number>(progress);
  const requestRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeModeRef.current = activeMode;
    requestRenderRef.current();
  }, [activeMode]);

  useEffect(() => {
    progressRef.current = progress;
    requestRenderRef.current();
  }, [progress]);

  // Smooth auto-play animation loop for the kinetic transformation scrubber
  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    const startVal = progressRef.current >= 0.98 ? 0 : progressRef.current;
    const startTime = performance.now();
    const duration = 2600;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const next = Number((startVal + (1 - startVal) * t).toFixed(3));
      setProgress(next);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080808');
    scene.fog = new THREE.FogExp2('#080808', 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.85, 4.4);
    camera.lookAt(0, 0.65, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xffe6b3, 0x17120d, 0.65);
    scene.add(hemi);

    const spotLight = new THREE.DirectionalLight(0xffc857, 2.1);
    spotLight.position.set(3, 6, 4);
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight(0xd6a342, 1.1);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const { pedestalGroup, outerEnergyRing, innerEnergyRing } = createShowroomPedestalGroup(
      1.95,
      true
    );
    scene.add(pedestalGroup);

    const meta =
      TRANSFORMATION_MODES.find((m) => m.id === activeMode) || TRANSFORMATION_MODES[0];
    const furnitureGroup = buildProceduralFurnitureGroup(meta.modelType, undefined, false);
    furnitureGroup.position.y = 0.06;
    scene.add(furnitureGroup);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        const p = progressRef.current;
        applyKineticTransformationToGroup(furnitureGroup, activeModeRef.current, p);

        // Rotate golden energy rings with transformation progress
        outerEnergyRing.rotation.z = p * Math.PI * 2;
        innerEnergyRing.rotation.y = -p * Math.PI * 2;

        if (activeModeRef.current !== 'sofa-orbital') {
          furnitureGroup.rotation.y = THREE.MathUtils.degToRad(-18 + p * 36);
        }

        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    requestRender();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
    };
  }, [activeMode]);

  const currentMeta =
    TRANSFORMATION_MODES.find((m) => m.id === activeMode) || TRANSFORMATION_MODES[0];
  const metrics = computeTransformationStage(activeMode, progress);

  return (
    <section
      id="cinematic-transformation"
      aria-labelledby="transformation-heading"
      className="relative py-24 px-6 bg-[#080808] border-t border-[#D6A342]/20 overflow-hidden"
    >
      {/* Golden Light Sweep Divider */}
      <div
        aria-hidden="true"
        className="h-px w-full max-w-[1380px] mx-auto mb-16 bg-gradient-to-r from-transparent via-[#FFC857] to-transparent opacity-60"
      />

      <div className="max-w-[1380px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D6A342] mb-3">
              <span>03. Kinetic Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Interactive 3D Assembly & Reveal</span>
            </div>
            <h2
              id="transformation-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-normal text-white leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              Cinematic Product Transformation
            </h2>
          </div>

          <p className="text-sm text-[#C8B9A6] max-w-md leading-relaxed">
            Command the 3D showroom mechanics in real time: assemble modular marble dining tables,
            open motorized bronze wardrobes, transform king-size beds, and orbit 360° luxury sofas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 4 Transformation Mode Selectors & Telemetry (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {TRANSFORMATION_MODES.map((item) => {
                const selected = activeMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveMode(item.id);
                      setProgress(0);
                      setTimeout(() => setIsPlaying(true), 80);
                    }}
                    className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#17120D] border-[#D6A342] shadow-[0_0_30px_rgba(214,163,66,0.14)]'
                        : 'bg-[#0E0C0A] border-white/10 hover:border-[#D6A342]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span className="text-xs font-mono-tabular text-[#FFC857]">
                        {selected ? `${Math.round(progress * 100)}%` : 'Select Stage'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D6A342] mb-2">{item.subtitle}</div>
                    <p className="text-xs text-[#B8ABA0] leading-relaxed">{item.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Real-Time Kinematic Readout Panel */}
            <div className="p-5 rounded-xl bg-[#17120D] border border-[#D6A342]/30 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-[#D6A342]">
                Active Kinetic State
              </div>
              <div
                data-testid="transformation-stage-caption"
                className="text-sm font-medium text-white"
              >
                {metrics.stageCaption}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Transformation Viewport & Scrubber (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0D0B09] border border-[#D6A342]/30 flex flex-col justify-between overflow-hidden relative min-h-[520px]">
            {/* Top Bar Inside 3D Stage */}
            <div className="p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#17120D]/80">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#D6A342]">
                  {currentMeta.label}
                </div>
                <div className="text-xs text-[#C8B9A6]">{currentMeta.subtitle}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/15 bg-[#080808] text-xs text-[#E5DAC8] hover:border-[#D6A342] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Disassemble (0%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (progress >= 0.98) {
                      setProgress(0);
                      setTimeout(() => setIsPlaying(true), 60);
                    } else {
                      setIsPlaying((prev) => !prev);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D6A342] text-[#080808] text-xs font-semibold hover:bg-[#FFC857] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Sequence</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Trigger Transformation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3D WebGL Transformation Canvas */}
            <div
              ref={mountRef}
              data-testid="transformation-3d-canvas"
              className="w-full h-[380px] sm:h-[420px]"
            />

            {/* Bottom Interactive Transformation Scrubber */}
            <div className="p-5 border-t border-white/10 bg-[#17120D]/90 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D6A342] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Manual Kinetic Scrubber</span>
                </span>
                <span className="font-mono-tabular text-[#FFC857]">
                  {Math.round(progress * 100)}% Complete
                </span>
              </div>
              <input
                type="range"
                aria-label="Kinetic Transformation Progress"
                min={0}
                max={1}
                step={0.01}
                value={progress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setProgress(parseFloat(e.target.value));
                }}
                className="w-full accent-[#D6A342] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
