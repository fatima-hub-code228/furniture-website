import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTS,
  COLLECTIONS,
  ASPECT_RATIO_OPTIONS,
  filterAndSortProducts,
  calculateCartSummary,
  updateCartItemQuantity,
  toggleWishlistItem,
  computeRoomFurnishState,
  computeTransformationStage,
  parseAspectRatioDimensions,
} from './catalog';

test('catalog covers all 6 futuristic luxury showroom categories', () => {
  assert.equal(COLLECTIONS.length, 6);
  for (const col of COLLECTIONS) {
    const matches = filterAndSortProducts(PRODUCTS, {
      category: col.id,
      searchQuery: '',
      sortBy: 'featured',
    });
    assert.ok(matches.length >= 1, `Expected items in collection ${col.id}`);
  }
});

test('filterAndSortProducts filters by showcaseTier, search query, and sorts by price', () => {
  const specialOffers = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    showcaseTier: 'special-offer',
    searchQuery: '',
    sortBy: 'price-asc',
  });
  assert.ok(specialOffers.length >= 3);
  for (let i = 1; i < specialOffers.length; i++) {
    assert.ok(specialOffers[i].price >= specialOffers[i - 1].price);
  }
});

test('updateCartItemQuantity and calculateCartSummary compute totals and complimentary delivery threshold', () => {
  let cart = updateCartItemQuantity([], 'solis-travertine-vessel-trio', 'Travertine Stone & 24K Gold Tray', 1);
  assert.equal(cart.length, 1);

  const summaryBelowThreshold = calculateCartSummary(cart, PRODUCTS);
  assert.equal(summaryBelowThreshold.subtotal, 1950);
  assert.equal(summaryBelowThreshold.whiteGloveDelivery, 250);
  assert.equal(summaryBelowThreshold.total, 2200);

  cart = updateCartItemQuantity(cart, 'sovereign-orbital-sofa', 'Obsidian Velvet & Champagne Gold', 1);
  const summaryAboveThreshold = calculateCartSummary(cart, PRODUCTS);
  assert.equal(summaryAboveThreshold.subtotal, 1950 + 16800);
  assert.equal(summaryAboveThreshold.whiteGloveDelivery, 0);
  assert.equal(summaryAboveThreshold.itemCount, 2);
});

test('toggleWishlistItem adds and removes product IDs cleanly', () => {
  const added = toggleWishlistItem([], 'sovereign-orbital-sofa');
  assert.deepEqual(added, ['sovereign-orbital-sofa']);
  const removed = toggleWishlistItem(added, 'sovereign-orbital-sofa');
  assert.deepEqual(removed, []);
});

test('computeRoomFurnishState transitions smoothly from empty stage to full showroom', () => {
  const emptyState = computeRoomFurnishState(0, 0, 6);
  assert.equal(emptyState.localProgress, 0);
  assert.ok(emptyState.elevationY > 1.0);

  const fullState = computeRoomFurnishState(1, 5, 6);
  assert.equal(fullState.localProgress, 1);
  assert.equal(fullState.elevationY, 0);
});

test('computeTransformationStage calculates dining assembly, wardrobe door angle, bed layers, and 360 sofa orbit', () => {
  const diningStart = computeTransformationStage('dining-assembly', 0);
  const diningEnd = computeTransformationStage('dining-assembly', 1);
  assert.ok(diningStart.pedestalSpreadX > 1.0);
  assert.equal(diningEnd.pedestalSpreadX, 0);
  assert.equal(diningEnd.tabletopLiftY, 0);

  const wardrobeOpen = computeTransformationStage('wardrobe-open', 1);
  assert.equal(wardrobeOpen.doorOpenAngleDeg, 108);

  const bedFrameOnly = computeTransformationStage('bed-furnish', 0.1);
  const bedComplete = computeTransformationStage('bed-furnish', 0.95);
  assert.equal(bedFrameOnly.bedLayerCount, 1);
  assert.equal(bedComplete.bedLayerCount, 4);

  const sofaOrbit = computeTransformationStage('sofa-orbital', 0.5);
  assert.equal(sofaOrbit.sofaOrbitAngleDeg, 180);
});

test('parseAspectRatioDimensions supports all 8 required aspect ratios', () => {
  assert.equal(ASPECT_RATIO_OPTIONS.length, 8);
  const cinematic = parseAspectRatioDimensions('21:9');
  assert.equal(cinematic.widthRatio, 21);
  assert.equal(cinematic.heightRatio, 9);
  assert.ok(cinematic.aspectNumeric > 2.3);
});

test('all collections and products exclusively use the 7 uploaded furniture images in the correct sections', () => {
  const expectedUploadedPaths = [
    '/assets/aistudio/image_9a06a734.png',
    '/assets/aistudio/image_3000d7e8.png',
    '/assets/aistudio/image_14a5aee4.png',
    '/assets/aistudio/image_3fb6bdc4.png',
    '/assets/aistudio/image_871bc257.png',
    '/assets/aistudio/image_38732a38.png',
    '/assets/aistudio/image_025f9b18.png',
  ];

  for (const col of COLLECTIONS) {
    assert.ok(
      expectedUploadedPaths.includes(col.coverImage),
      `Collection ${col.id} coverImage ${col.coverImage} must be an uploaded asset`
    );
  }

  for (const prod of PRODUCTS) {
    assert.ok(
      expectedUploadedPaths.includes(prod.image),
      `Product ${prod.id} image ${prod.image} must be an uploaded asset`
    );
    assert.ok(
      expectedUploadedPaths.includes(prod.secondaryImage),
      `Product ${prod.id} secondaryImage ${prod.secondaryImage} must be an uploaded asset`
    );
  }

  // Verify section-specific assignments
  const sofaCol = COLLECTIONS.find((c) => c.id === 'sofas-living');
  const bedCol = COLLECTIONS.find((c) => c.id === 'modern-bedroom');
  const diningCol = COLLECTIONS.find((c) => c.id === 'dining-tables-chairs');
  const wardrobeCol = COLLECTIONS.find((c) => c.id === 'wardrobes-storage');

  assert.equal(sofaCol?.coverImage, '/assets/aistudio/image_9a06a734.png');
  assert.equal(bedCol?.coverImage, '/assets/aistudio/image_14a5aee4.png');
  assert.equal(diningCol?.coverImage, '/assets/aistudio/image_3fb6bdc4.png');
  assert.equal(wardrobeCol?.coverImage, '/assets/aistudio/image_871bc257.png');
});

