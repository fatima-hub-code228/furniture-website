/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  Box,
  ArrowUpRight,
  Compass,
  Check,
  Award,
  ShieldCheck,
  Send,
  MapPin,
  Phone,
  Clock,
} from 'lucide-react';
import {
  RoomId,
  CartItem,
  COLLECTIONS,
  CollectionId,
  filterAndSortProducts,
  PRODUCTS,
  FurnitureProduct,
  ShowcaseTier,
  calculateCartSummary,
  updateCartItemQuantity,
  toggleWishlistItem,
  UPLOADED_BED_KING,
  UPLOADED_DINING_SUITE,
  UPLOADED_SOFA_BOUCLE,
  UPLOADED_WARDROBE_STORAGE,
} from './data/catalog';
import { DreamHomeHero3D } from './components/DreamHomeHero3D';
import { CinematicTransformation3D } from './components/CinematicTransformation3D';
import { FloatingProductModal3D } from './components/FloatingProductModal3D';
import { BespokeVisualizerSection } from './components/BespokeVisualizerSection';
import { CartAndWishlistDrawer } from './components/CartAndWishlistDrawer';

const SHOWCASE_TIER_TABS: Array<{ id: ShowcaseTier; label: string; badge: string }> = [
  { id: 'all', label: 'All Showroom Pieces', badge: '12 Editions' },
  { id: 'featured', label: 'Featured Products', badge: 'Stage Icons' },
  { id: 'bestseller', label: 'Best Sellers', badge: 'Most Coveted' },
  { id: 'new-arrival', label: 'New Arrivals', badge: '2025 Premiere' },
  { id: 'special-offer', label: 'Special Offers', badge: 'Private Privilege' },
];

export default function App() {
  // 3D Showroom Camera & Furnishing State
  const [activeZone, setActiveZone] = useState<RoomId>('living');
  const [furnishProgress, setFurnishProgress] = useState<number>(1);

  // Catalog Filtering, Tier & Search State
  const [selectedCategory, setSelectedCategory] = useState<CollectionId>('all');
  const [selectedTier, setSelectedTier] = useState<ShowcaseTier>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // 3D Product Inspector Modal State
  const [inspectedProduct, setInspectedProduct] = useState<FurnitureProduct | null>(null);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productId: PRODUCTS[0].id,
      quantity: 1,
      finishName: PRODUCTS[0].finishes[0].name,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['apex-cantilever-king-bed']);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'cart' | 'wishlist'>('cart');
  const [recentAddedId, setRecentAddedId] = useState<string | null>(null);

  // Contact Concierge State
  const [conciergeName, setConciergeName] = useState('');
  const [conciergeEmail, setConciergeEmail] = useState('');
  const [conciergeInterest, setConciergeInterest] = useState('Private 3D Showroom Tour');
  const [conciergeNotes, setConciergeNotes] = useState('');
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);
  const [conciergeError, setConciergeError] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(PRODUCTS, {
        category: selectedCategory,
        showcaseTier: selectedTier,
        searchQuery,
        sortBy,
      }),
    [selectedCategory, searchQuery, sortBy, selectedTier]
  );

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  );

  const cartSummary = useMemo(
    () => calculateCartSummary(cartItems, PRODUCTS),
    [cartItems]
  );

  const handleAddToCart = (
    product: FurnitureProduct,
    finishName?: string,
    quantityToAdd: number = 1
  ) => {
    const chosenFinish = finishName || product.finishes[0].name;
    setCartItems((prev) =>
      updateCartItemQuantity(prev, product.id, chosenFinish, quantityToAdd)
    );

    setRecentAddedId(product.id);
    window.setTimeout(() => {
      setRecentAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  const handleUpdateCartQuantity = (productId: string, finishName: string, delta: number) => {
    setCartItems((prev) => updateCartItemQuantity(prev, productId, finishName, delta));
  };

  const handleRemoveCartItem = (productId: string, finishName: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.finishName === finishName)
      )
    );
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => toggleWishlistItem(prev, productId));
  };

  const handleSelectCollectionCard = (category: CollectionId, roomZone: RoomId) => {
    setSelectedCategory(category);
    setSelectedTier('all');
    setActiveZone(roomZone);
    const catalogEl = document.getElementById('collections-showcase');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreShowroom = () => {
    const el = document.getElementById('showroom-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeName.trim() || !conciergeEmail.trim()) {
      setConciergeError(
        'Please provide your name and email address to schedule a private session.'
      );
      return;
    }
    setConciergeError(null);
    setConciergeSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#D6A342] selection:text-[#080808]">
      {/* 3-Zone Top Bar Contract: Brand Wordmark | Single-Line Navigation | Primary Action CTA */}
      <header className="sticky top-0 z-40 h-20 bg-[#080808]/95 backdrop-blur-md border-b border-[#D6A342]/30">
        <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#D6A342] to-[#FFC857] text-[#080808]">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span
                className="block text-xl tracking-[0.26em] uppercase font-serif text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                DREAMHOME
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-[0.24em] text-[#FFC857]">
                FUTURISTIC 3D SHOWROOM
              </span>
            </div>
          </a>

          {/* Zone 2: Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-[0.18em] text-[#D8CFC2] whitespace-nowrap"
          >
            <a href="#top" className="hover:text-[#FFC857] transition-colors">
              3D Showroom
            </a>
            <a href="#showroom-categories" className="hover:text-[#FFC857] transition-colors">
              Categories
            </a>
            <a href="#cinematic-transformation" className="hover:text-[#FFC857] transition-colors">
              3D Transformations
            </a>
            <a href="#collections-showcase" className="hover:text-[#FFC857] transition-colors">
              Featured &amp; Offers
            </a>
            <a href="#about-dreamhome" className="hover:text-[#FFC857] transition-colors">
              About &amp; Concierge
            </a>
          </nav>

          {/* Zone 3: Single Primary Action CTA (Showroom Bag) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDrawerTab('cart');
                setDrawerOpen(true);
              }}
              aria-label={`Open Showroom Bag with ${cartSummary.itemCount} items`}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.18em] font-bold hover:brightness-110 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Showroom Bag ({cartSummary.itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1 & 2: CINEMATIC HERO + FUTURISTIC 3D SHOWROOM */}
        <DreamHomeHero3D
          activeZone={activeZone}
          onSelectZone={setActiveZone}
          furnishProgress={furnishProgress}
          onChangeFurnishProgress={setFurnishProgress}
          onInspectProduct={setInspectedProduct}
          onExploreShowroom={handleExploreShowroom}
        />

        {/* SECTION 3: FURNITURE CATEGORIES (Circular Pedestal Cards) */}
        <section
          id="showroom-categories"
          aria-labelledby="categories-heading"
          className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12 border-b border-[#D6A342]/20"
        >
          <div className="animate-cinematic-enter flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#FFC857] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                01 / FUTURISTIC SHOWROOM CATEGORIES
              </span>
              <h2
                id="categories-heading"
                className="text-3xl md:text-5xl font-serif text-white leading-[1.08]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Six Architectural Pedestal Collections
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#C8B99E] max-w-md">
              Select any category below to glide the 3D showroom camera directly to its circular
              obsidian stage and filter the live catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLECTIONS.map((col, index) => {
              const isSelected = selectedCategory === col.id;

              return (
                <article
                  key={col.id}
                  className={`group relative overflow-hidden border transition-all duration-300 bg-[#17120D] flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#FFC857] shadow-[0_20px_50px_rgba(214,163,66,0.22)]'
                      : 'border-[#D6A342]/30 hover:border-[#FFC857]'
                  }`}
                >
                  <div className="relative h-64 overflow-hidden bg-[#080808]">
                    <img
                      src={col.coverImage}
                      alt={col.title}
                      loading="eager"
                      style={{ objectPosition: col.imagePosition || 'center center' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#080808]/90 backdrop-blur-sm border border-[#D6A342]/45 text-[11px] font-mono uppercase tracking-widest text-[#FFC857]">
                      PEDESTAL 0{index + 1}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#FFC857] mb-1">
                        {col.architecturalNote}
                      </p>
                      <h3
                        className="text-2xl font-serif text-white mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {col.title}
                      </h3>
                      <p className="text-xs text-[#C8B99E] leading-relaxed mb-5">
                        {col.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCollectionCard(col.id, col.roomId)}
                      className="inline-flex items-center justify-between w-full pt-4 border-t border-[#D6A342]/25 text-xs font-mono uppercase tracking-[0.18em] text-white group-hover:text-[#FFC857] transition-colors cursor-pointer"
                    >
                      <span>Enter {col.shortTitle} Stage</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: CINEMATIC PRODUCT TRANSFORMATION (Interactive 3D Kinetic Showcase) */}
        <CinematicTransformation3D />

        {/* SECTIONS 4, 5, 6, 7: FEATURED PRODUCTS, BEST SELLERS, NEW ARRIVALS & SPECIAL OFFERS */}
        <section
          id="collections-showcase"
          aria-labelledby="showcase-heading"
          className="py-20 md:py-28 bg-[#080808]"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="animate-cinematic-enter flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#FFC857] mb-3">
                  <Box className="w-3.5 h-3.5" />
                  03 / INTERACTIVE 3D SHOWROOM CATALOG
                </span>
                <h2
                  id="showcase-heading"
                  className="text-3xl md:text-5xl font-serif text-white leading-[1.08]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Featured, Best Sellers, New Arrivals &amp; Special Offers
                </h2>
              </div>

              {/* Search, Sort & Saved Wishlist Trigger */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px] sm:min-w-[280px]">
                  <Search className="w-4 h-4 text-[#FFC857] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    aria-label="Search furniture catalog"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sofa, king bed, dining, wardrobe..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#17120D] border border-[#D6A342]/40 text-xs text-white placeholder-[#8E7F68] focus:outline-none focus:border-[#FFC857]"
                  />
                </div>

                <select
                  aria-label="Sort furniture pieces"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                  }
                  className="px-3.5 py-2.5 bg-[#17120D] border border-[#D6A342]/40 text-xs font-mono text-white focus:outline-none focus:border-[#FFC857] cursor-pointer"
                >
                  <option value="featured">Sort: Curated Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerTab('wishlist');
                    setDrawerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#17120D] border border-[#D6A342]/40 text-xs font-mono text-[#FFC857] hover:border-[#FFC857] transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#FFC857]" />
                  <span>Saved ({wishlistIds.length})</span>
                </button>
              </div>
            </div>

            {/* Showcase Tier Tabs: Featured Products | Best Sellers | New Arrivals | Special Offers */}
            <div
              role="tablist"
              aria-label="Filter by Showcase Tier"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6"
            >
              {SHOWCASE_TIER_TABS.map((tier) => {
                const active = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-3.5 text-left border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#D6A342] text-[#080808] border-[#FFC857] font-bold shadow-[0_0_20px_rgba(214,163,66,0.3)]'
                        : 'bg-[#17120D] text-white border-[#D6A342]/30 hover:border-[#FFC857]'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-mono uppercase tracking-[0.2em] mb-0.5 ${
                        active ? 'text-[#080808]/80' : 'text-[#FFC857]'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <span className="block text-xs font-mono uppercase tracking-wider">
                      {tier.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Category Filter Pills */}
            <div
              role="tablist"
              aria-label="Filter by Furniture Category"
              className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[#D6A342]/25"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#FFC857] text-[#080808] font-bold'
                    : 'bg-[#17120D] text-[#D8CFC2] border border-[#D6A342]/30 hover:border-[#D6A342]'
                }`}
              >
                All Categories ({PRODUCTS.length})
              </button>

              {COLLECTIONS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FFC857] text-[#080808] font-bold'
                        : 'bg-[#17120D] text-[#D8CFC2] border border-[#D6A342]/30 hover:border-[#D6A342]'
                    }`}
                  >
                    {cat.shortTitle}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#17120D] border border-[#D6A342]/35">
                <p className="text-xl font-serif text-white mb-2">
                  No pieces match your current filter criteria
                </p>
                <p className="text-xs text-[#C8B99E] mb-6">
                  Reset your search query or category filter to view all 12 showroom editions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTier('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-[#D6A342] text-[#080808] font-bold text-xs font-mono uppercase tracking-widest cursor-pointer"
                >
                  Reset Showroom Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const wishlisted = wishlistIds.includes(product.id);
                  const justAdded = recentAddedId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="bg-[#17120D] border border-[#D6A342]/35 hover:border-[#FFC857] transition-all duration-300 hover:-translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.75)] flex flex-col justify-between"
                    >
                      {/* Top Visual Frame */}
                      <div>
                        <div className="relative h-72 overflow-hidden bg-[#080808] group">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="eager"
                            style={{ objectPosition: product.imagePosition || 'center center' }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#080808]/90 backdrop-blur-sm border border-[#D6A342]/50 text-[10px] font-mono uppercase tracking-widest text-[#FFC857]">
                            {product.showcaseTiers.includes('special-offer')
                              ? 'Special Offer'
                              : product.showcaseTiers.includes('bestseller')
                              ? 'Best Seller'
                              : 'Showroom Icon'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(product.id)}
                            aria-label={`Save ${product.name} to wishlist`}
                            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-[#080808]/90 hover:bg-[#D6A342] border border-[#D6A342]/45 text-white hover:text-[#080808] transition-colors cursor-pointer"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                wishlisted ? 'fill-[#FFC857] text-[#FFC857]' : ''
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => setInspectedProduct(product)}
                            className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#080808]/90 hover:bg-[#D6A342] text-[#FFC857] hover:text-[#080808] border border-[#D6A342]/60 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Box className="w-3.5 h-3.5" />
                            <span>Inspect 360° 3D</span>
                          </button>
                        </div>

                        {/* Card Copy */}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-wider text-[#C8B99E] mb-1">
                            <span>{product.collectionLabel}</span>
                            <div className="flex items-center gap-2">
                              {product.originalPrice && (
                                <span className="text-xs font-mono text-[#8E7F68] line-through">
                                  ${product.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <span className="text-sm font-semibold text-[#FFC857]">
                                ${product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <h3
                            className="text-2xl font-serif text-white mb-1"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-[#C8B99E] mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Color Dots & Dimensions */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#D6A342]/25 text-xs text-[#C8B99E]">
                            <div className="flex items-center gap-1.5">
                              {product.finishes.map((f) => (
                                <span
                                  key={f.name}
                                  title={f.name}
                                  className="w-3.5 h-3.5 rounded-full border border-white/30"
                                  style={{ backgroundColor: f.swatchHex }}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[11px]">{product.dimensions}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.18em] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {justAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setInspectedProduct(product)}
                          className="py-3 px-3.5 border border-[#D6A342]/45 bg-[#080808] text-[#FFC857] hover:bg-[#D6A342] hover:text-[#080808] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          3D View
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* BESPOKE 3D STUDIO VISUALIZER */}
        <BespokeVisualizerSection />

        {/* SECTIONS 8 & 9: ABOUT DREAMHOME & PRIVATE CONCIERGE CONTACT */}
        <section
          id="about-dreamhome"
          aria-labelledby="about-heading"
          className="py-20 md:py-28 bg-[#080808] border-b border-[#D6A342]/25"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* About DreamHome Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#FFC857]">
                <Award className="w-3.5 h-3.5" />
                04 / ABOUT DREAMHOME ARCHITECTURAL ATELIER
              </span>
              <h2
                id="about-heading"
                className="text-3xl md:text-5xl font-serif text-white leading-[1.08]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Where Futuristic 3D Engineering Meets Hand-Finished Italian Craft
              </h2>
              <p className="text-sm md:text-base text-[#D8CFC2] leading-relaxed">
                Founded for discerning collectors and architectural visionaries, DREAMHOME replaces
                static furniture browsing with a live 3D holographic showroom. Every sofa,
                sculptural pedestal dining table, and gold-inlaid king bed is engineered from
                kiln-dried hardwood, honed natural stone, and 24K brushed gold hardware.
              </p>

              {/* Curated Uploaded Showroom Interior Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { src: UPLOADED_SOFA_BOUCLE, label: 'Living Sanctuary', pos: 'center 70%' },
                  { src: UPLOADED_BED_KING, label: 'Royal Bedroom', pos: 'center 62%' },
                  { src: UPLOADED_DINING_SUITE, label: 'Dining Salon', pos: 'center 72%' },
                  { src: UPLOADED_WARDROBE_STORAGE, label: 'Atelier Vitrine', pos: 'center 52%' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group relative h-28 overflow-hidden border border-[#D6A342]/35 bg-[#17120D]"
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{ objectPosition: item.pos }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-mono uppercase tracking-wider text-[#FFC857]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-[#17120D] border border-[#D6A342]/35">
                  <ShieldCheck className="w-5 h-5 text-[#FFC857] mb-2" />
                  <h3 className="text-base font-serif text-white mb-1">
                    Lifetime Structural Guarantee
                  </h3>
                  <p className="text-xs text-[#C8B99E]">
                    Every frame and stone plinth is serialized and backed by our private atelier
                    warranty.
                  </p>
                </div>
                <div className="p-5 bg-[#17120D] border border-[#D6A342]/35">
                  <Compass className="w-5 h-5 text-[#FFC857] mb-2" />
                  <h3 className="text-base font-serif text-white mb-1">
                    Global White-Glove Installation
                  </h3>
                  <p className="text-xs text-[#C8B99E]">
                    Our architectural installation team delivers, assembles, and calibrates lighting
                    in your residence.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D6A342]/25 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#C8B99E]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFC857] shrink-0" />
                  <span>Milan • Beverly Hills • Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFC857] shrink-0" />
                  <span>+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFC857] shrink-0" />
                  <span>24/7 Private Concierge</span>
                </div>
              </div>
            </div>

            {/* Contact Us / Private Showroom Concierge Form */}
            <div className="lg:col-span-6 bg-[#17120D] border border-[#D6A342]/40 p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
              <h3
                className="text-2xl md:text-3xl font-serif text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Contact DREAMHOME Private Concierge
              </h3>
              <p className="text-xs text-[#C8B99E] mb-6">
                Request bespoke architectural CAD files, private showroom appointments, or custom
                stone &amp; upholstery swatches.
              </p>

              {conciergeSubmitted ? (
                <div className="p-6 bg-[#080808] border border-[#FFC857] text-center">
                  <Check className="w-8 h-8 text-[#FFC857] mx-auto mb-2" />
                  <h4 className="text-xl font-serif text-white mb-1">
                    Concierge Dossier Registered
                  </h4>
                  <p className="text-xs text-[#D8CFC2] mb-4">
                    Thank you, <strong className="text-[#FFC857]">{conciergeName}</strong>. A Senior
                    DREAMHOME Architect will reach out to{' '}
                    <strong className="text-[#FFC857]">{conciergeEmail}</strong> regarding your{' '}
                    <strong className="text-[#FFC857]">{conciergeInterest}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConciergeSubmitted(false)}
                    className="px-4 py-2 bg-[#D6A342] text-[#080808] text-xs font-mono uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConciergeSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="concierge-name"
                        className="block text-xs font-mono uppercase tracking-wider text-[#FFC857] mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="concierge-name"
                        type="text"
                        value={conciergeName}
                        onChange={(e) => {
                          setConciergeName(e.target.value);
                          if (conciergeError) setConciergeError(null);
                        }}
                        placeholder="Alexander Sterling"
                        className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="concierge-email"
                        className="block text-xs font-mono uppercase tracking-wider text-[#FFC857] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="concierge-email"
                        type="email"
                        value={conciergeEmail}
                        onChange={(e) => {
                          setConciergeEmail(e.target.value);
                          if (conciergeError) setConciergeError(null);
                        }}
                        placeholder="sterling@atelier.com"
                        className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="concierge-interest"
                      className="block text-xs font-mono uppercase tracking-wider text-[#FFC857] mb-1.5"
                    >
                      Bespoke Service Inquiry
                    </label>
                    <select
                      id="concierge-interest"
                      value={conciergeInterest}
                      onChange={(e) => setConciergeInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#D6A342]/40 text-sm text-white"
                    >
                      <option value="Private 3D Showroom Tour">Private 3D Showroom Tour</option>
                      <option value="Full Residence Furnishing">Full Residence Furnishing</option>
                      <option value="Custom Marble & Upholstery Commission">
                        Custom Marble &amp; Upholstery Commission
                      </option>
                      <option value="Architectural Trade Partnership">
                        Architectural Trade Partnership
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="concierge-notes"
                      className="block text-xs font-mono uppercase tracking-wider text-[#FFC857] mb-1.5"
                    >
                      Project Dimensions or Notes
                    </label>
                    <textarea
                      id="concierge-notes"
                      rows={3}
                      value={conciergeNotes}
                      onChange={(e) => setConciergeNotes(e.target.value)}
                      placeholder="Share preferred finishes, room dimensions, or target installation timeline..."
                      className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68]"
                    />
                  </div>

                  {conciergeError && (
                    <p role="alert" className="text-xs text-[#FFC857] font-medium">
                      {conciergeError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Schedule Private Showroom Consultation</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 10: DARK-LUXURY FOOTER */}
      <footer className="bg-[#080808] text-[#D8CFC2] py-16 border-t border-[#D6A342]/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#D6A342]/20">
          <div className="md:col-span-5">
            <span
              className="block text-2xl tracking-[0.26em] uppercase font-serif text-white mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              DREAMHOME
            </span>
            <p className="text-xs text-[#C8B99E] max-w-sm leading-relaxed mb-4">
              &ldquo;ENTER THE WORLD OF LUXURY&rdquo; — An interactive 3D architectural furniture
              showroom crafted with obsidian marble stages, rotating golden energy rings, and
              bespoke Italian materials.
            </p>
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#FFC857]">
              360° WebGL Showroom • White-Glove Global Delivery
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFC857] mb-3">
              Showroom Pedestal Collections
            </h3>
            <ul className="space-y-2 text-xs text-[#D8CFC2]">
              {COLLECTIONS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectCollectionCard(c.id, c.roomId)}
                    className="hover:text-[#FFC857] transition-colors cursor-pointer"
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFC857] mb-3">
              Direct Showroom Access
            </h3>
            <p className="text-xs text-[#C8B99E] leading-relaxed mb-4">
              Every silhouette is available for real-time 360° inspection, kinetic transformation,
              and custom material commissioning.
            </p>
            <button
              type="button"
              onClick={() => {
                setDrawerTab('cart');
                setDrawerOpen(true);
              }}
              className="px-4 py-2.5 border border-[#D6A342] text-xs font-mono uppercase tracking-widest text-[#FFC857] hover:bg-[#D6A342] hover:text-[#080808] transition-colors cursor-pointer"
            >
              Open Showroom Bag ({cartSummary.itemCount})
            </button>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8E7F68]">
          <span>© {new Date().getFullYear()} DREAMHOME Architectural 3D Showroom.</span>
          <span className="text-[#D6A342]">OBSIDIAN &amp; 24K GOLD EDITION</span>
        </div>
      </footer>

      {/* Full-Screen 3D Product Experience Modal */}
      <FloatingProductModal3D
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={inspectedProduct ? wishlistIds.includes(inspectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart & Wishlist Slide-Over Drawer */}
      <CartAndWishlistDrawer
        isOpen={drawerOpen}
        activeTab={drawerTab}
        onSwitchTab={setDrawerTab}
        onClose={() => setDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveCartItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onMoveWishlistToCart={(product) => {
          handleAddToCart(product);
          setDrawerTab('cart');
        }}
      />
    </div>
  );
}
