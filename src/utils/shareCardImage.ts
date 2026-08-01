/**
 * Share card image generation.
 *
 * Captures an Ayat card element to a canvas using html-to-image, then composites the promotional
 * app banner onto the bottom before encoding the PNG.
 */

import { toCanvas } from 'html-to-image';

/** Promotional strip shown at the bottom of every exported card (624x156 source). */
const PROMO_BANNER_SRC = '/assets/promo-banner.jpg';

/** Export scale. 340x520 card -> 680x1040 px capture. */
const CAPTURE_SCALE = 2;

// ==========================================
// Promo banner loader (cached after first load)
// ==========================================
let bannerPromise: Promise<HTMLImageElement | null> | null = null;

function loadPromoBanner(): Promise<HTMLImageElement | null> {
  if (bannerPromise) return bannerPromise;
  bannerPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    // A missing banner must not break the download — resolve null and export
    // the card on its own.
    img.onerror = () => {
      console.warn('Promo banner failed to load; exporting card without it.');
      resolve(null);
    };
    img.src = PROMO_BANNER_SRC;
  });
  return bannerPromise;
}

// ==========================================
// Capture
// ==========================================
async function captureCard(element: HTMLElement): Promise<HTMLCanvasElement> {
  // Use html-to-image instead of html2canvas for perfect font and layout rendering
  return toCanvas(element, {
    pixelRatio: CAPTURE_SCALE,
    backgroundColor: null,
    style: {
      transform: 'none',
    },
    // We can also configure fonts to wait for them, but html-to-image does a good job by default
  });
}

/**
 * Stacks the promo banner underneath the captured card. The banner is scaled to
 * the card's width, preserving its aspect ratio, so the seam lines up exactly.
 */
function composeWithBanner(
  card: HTMLCanvasElement,
  banner: HTMLImageElement,
): HTMLCanvasElement {
  const bannerHeight = Math.round(
    (banner.naturalHeight / banner.naturalWidth) * card.width,
  );

  const out = document.createElement('canvas');
  out.width = card.width;
  out.height = card.height + bannerHeight;

  const ctx = out.getContext('2d');
  if (!ctx) return card;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(card, 0, 0);
  ctx.drawImage(banner, 0, card.height, out.width, bannerHeight);

  return out;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}

/**
 * Renders a card element to a PNG blob with the promotional banner attached at
 * the bottom. Returns null if capture fails.
 */
export async function captureCardWithBanner(
  element: HTMLElement,
): Promise<Blob | null> {
  try {
    const [card, banner] = await Promise.all([
      captureCard(element),
      loadPromoBanner(),
    ]);
    const composed = banner ? composeWithBanner(card, banner) : card;
    return await canvasToBlob(composed);
  } catch (err) {
    console.error('Card capture failed:', err);
    return null;
  }
}

/** Warms the banner cache so the first export feels instant. */
export function prewarmShareAssets(): void {
  void loadPromoBanner();
}
