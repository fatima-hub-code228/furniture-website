import React, { useState } from 'react';
import { Sparkles, Loader2, Maximize2, Wand2, Check } from 'lucide-react';
import {
  ASPECT_RATIO_OPTIONS,
  AspectRatioOption,
  parseAspectRatioDimensions,
  UPLOADED_SOFA_SECTIONAL,
  UPLOADED_BED_KING,
  UPLOADED_DINING_SUITE,
} from '../data/catalog';

const PRESET_PROMPTS = [
  {
    prompt:
      'Futuristic dark marble penthouse living room with a curved ivory bouclé sofa floating on a golden lit circular obsidian platform, dramatic cinema spotlights',
    previewImage: UPLOADED_SOFA_SECTIONAL,
    imagePosition: 'center 70%',
  },
  {
    prompt:
      'Architectural obsidian master bedroom with a bronze-framed king bed, illuminated golden halo rings, warm amber accent strips',
    previewImage: UPLOADED_BED_KING,
    imagePosition: 'center 62%',
  },
  {
    prompt:
      'Sculptural travertine and brushed gold dining table inside a dark luxury glass pavilion overlooking a nocturnal skyline',
    previewImage: UPLOADED_DINING_SUITE,
    imagePosition: 'center 72%',
  },
];

export const BespokeVisualizerSection: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    aspectRatio: AspectRatioOption;
    prompt: string;
    source: string;
  } | null>(null);

  const dims = parseAspectRatioDimensions(aspectRatio);
  const activePreset = PRESET_PROMPTS[activePresetIdx] || PRESET_PROMPTS[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      setErrorMessage(
        'Please describe the luxury room or bespoke furniture concept you wish to visualize.'
      );
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, aspectRatio }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.error || 'Unable to generate concept render at this moment.');
      } else {
        setGeneratedResult({
          imageUrl: data.imageUrl,
          aspectRatio: data.aspectRatio || aspectRatio,
          prompt: trimmed,
          source: data.source || 'studio',
        });
      }
    } catch {
      setErrorMessage('Network error while contacting the bespoke rendering studio.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      id="bespoke-studio"
      aria-labelledby="bespoke-studio-heading"
      className="py-20 md:py-28 bg-[#0D0A08] border-t border-b border-[#D6A342]/25"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Studio Prompt & Aspect Ratio Configuration */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#17120D] border border-[#D6A342]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#FFC857] mb-4">
              <Wand2 className="w-3.5 h-3.5" />
              Bespoke 3D Concept Visualizer
            </div>

            <h2
              id="bespoke-studio-heading"
              className="text-3xl md:text-5xl font-serif text-white leading-[1.08] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Commission Your Custom Showroom Concept
            </h2>

            <p className="text-sm md:text-base text-[#C8B99E] leading-relaxed mb-8">
              Describe your dream architectural interior, custom upholstery, or sculptural
              proportions. Select your preferred framing aspect ratio to preview or generate a
              bespoke DREAMHOME concept.
            </p>

            <form onSubmit={handleGenerate} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="bespoke-prompt-input"
                  className="block text-xs font-mono uppercase tracking-[0.18em] text-[#FFC857] mb-2"
                >
                  Architectural &amp; Furniture Vision
                </label>
                <textarea
                  id="bespoke-prompt-input"
                  rows={3}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Describe your custom room lighting, marble surfaces, gold accents, and furniture arrangement..."
                  className="w-full p-3.5 bg-[#17120D] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68] focus:outline-none focus:border-[#FFC857] transition-colors"
                />
                {errorMessage && (
                  <p role="alert" className="mt-2 text-xs text-[#FFC857] font-medium">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Preset Inspirations */}
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-[#C8B99E] mb-2">
                  Curated Showroom Prompts
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActivePresetIdx(idx);
                        setPrompt(item.prompt);
                        setGeneratedResult(null);
                        setErrorMessage(null);
                      }}
                      className={`text-left text-xs px-3 py-1.5 border transition-colors cursor-pointer ${
                        activePresetIdx === idx
                          ? 'bg-[#D6A342]/20 border-[#FFC857] text-[#FFC857]'
                          : 'bg-[#17120D] border-[#D6A342]/30 text-[#D8CFC2] hover:border-[#FFC857] hover:text-[#FFC857]'
                      }`}
                    >
                      Concept 0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-[0.18em] text-[#FFC857]">
                    Canvas Aspect Ratio
                  </label>
                  <span className="text-xs font-mono text-[#C8B99E]">
                    Selected: <strong className="text-white">{aspectRatio}</strong>
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Select Image Aspect Ratio"
                  className="grid grid-cols-4 gap-2"
                >
                  {ASPECT_RATIO_OPTIONS.map((option) => {
                    const active = aspectRatio === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setAspectRatio(option.value)}
                        className={`py-2.5 px-3 text-xs font-mono border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? 'bg-[#D6A342] text-[#080808] border-[#FFC857] font-bold'
                            : 'bg-[#17120D] text-[#D8CFC2] border-[#D6A342]/30 hover:border-[#D6A342]'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.22em] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rendering Custom Concept ({aspectRatio})...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Bespoke Render ({aspectRatio})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Proportional Render Viewport */}
          <div className="lg:col-span-7">
            <div className="bg-[#17120D] border border-[#D6A342]/35 p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.75)]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D6A342]/25">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FFC857]">
                  <Maximize2 className="w-3.5 h-3.5 text-[#D6A342]" />
                  <span>Architectural Frame Preview</span>
                </div>
                <span className="text-xs font-mono text-[#C8B99E]">
                  Aspect Ratio {aspectRatio} • {dims.widthRatio}:{dims.heightRatio}
                </span>
              </div>

              <div className="flex items-center justify-center min-h-[340px] bg-[#080808] border border-[#D6A342]/25 p-4">
                {generatedResult ? (
                  <figure className="w-full flex flex-col items-center">
                    <img
                      src={generatedResult.imageUrl}
                      alt={generatedResult.prompt}
                      style={{
                        aspectRatio: generatedResult.aspectRatio.replace(':', ' / '),
                      }}
                      className="max-h-[460px] w-auto object-cover border border-[#D6A342]/45 shadow-lg"
                    />
                    <figcaption className="mt-3 text-xs font-mono text-[#C8B99E] text-center max-w-xl">
                      Rendered in {generatedResult.aspectRatio} — &ldquo;{generatedResult.prompt}
                      &rdquo;
                    </figcaption>
                  </figure>
                ) : (
                  <figure className="w-full flex flex-col items-center group overflow-hidden">
                    <div
                      style={{
                        aspectRatio: aspectRatio.replace(':', ' / '),
                      }}
                      className="relative max-h-[420px] w-full max-w-2xl overflow-hidden border border-[#D6A342]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                    >
                      <img
                        src={activePreset.previewImage}
                        alt={activePreset.prompt}
                        style={{
                          objectPosition: activePreset.imagePosition,
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-[#080808]/20" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-[#080808]/85 backdrop-blur-sm border border-[#D6A342]/40">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFC857]">
                          Showroom Reference ({aspectRatio})
                        </span>
                        <span className="text-[11px] font-mono text-[#D8CFC2]">
                          Hover to Zoom • Click Generate for Custom Render
                        </span>
                      </div>
                    </div>
                  </figure>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

