/**
 * Location image helpers: return 2–3 car images from /public/car for each branch.
 * Uses actual filenames present in the folder (car model/type names).
 * Images are chosen deterministically by branch id so each location shows different
 * cars but the same location keeps the same set (no flicker on reload).
 */

/** Base path for car images (Next.js serves from /car/...). */
const CAR_IMAGES_BASE = "/car";

/** Image filenames in public/car (ประเภทรถ – car types). Add new files here when you add images. */
const CAR_IMAGE_FILES = [
  "Benz E300 e.png",
  "Honda City Hatchback.png",
  "Honda Civic.png",
  "Toyota Fortuner.png",
  "Toyota Innova1.png",
  "Toyota Revo Smart cab.png",
  "Toyota Veloz.png",
  "Toyota Yaris.png",
  "honda CR-V.png",
  "honda HR-V.png",
  "honda city.png",
];

/** Full paths for Next.js Image (encode spaces in filenames). */
const CAR_IMAGES = CAR_IMAGE_FILES.map(
  (name) => `${CAR_IMAGES_BASE}/${encodeURIComponent(name)}`
);

/** Return public URL for a car image filename (for mock data, vehicle cards, etc.). */
export function getCarImageUrl(filename: string): string {
  return `${CAR_IMAGES_BASE}/${encodeURIComponent(filename)}`;
}

/** Pairs of (display name, image filename) so mock data can align with files in public/car. */
export const CAR_MODELS_FOR_MOCK: { name: string; filename: string }[] = [
  { name: "Toyota Yaris or similar", filename: "Toyota Yaris.png" },
  { name: "Honda City or similar", filename: "honda city.png" },
  { name: "Honda Civic or similar", filename: "Honda Civic.png" },
  { name: "Toyota Fortuner or similar", filename: "Toyota Fortuner.png" },
  { name: "Toyota Innova or similar", filename: "Toyota Innova1.png" },
  { name: "Toyota Revo Smart cab or similar", filename: "Toyota Revo Smart cab.png" },
  { name: "Toyota Veloz or similar", filename: "Toyota Veloz.png" },
  { name: "Honda CR-V or similar", filename: "honda CR-V.png" },
  { name: "Honda HR-V or similar", filename: "honda HR-V.png" },
  { name: "Honda City Hatchback or similar", filename: "Honda City Hatchback.png" },
  { name: "Mercedes-Benz E300 e or similar", filename: "Benz E300 e.png" },
];

/** Fallback when an image fails to load or no images are available. */
export const LOCATION_IMAGE_FALLBACK =
  CAR_IMAGES[0] ?? `${CAR_IMAGES_BASE}/${encodeURIComponent("Benz E300 e.png")}`;

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Returns 2–3 car image paths for a location. Selection is deterministic by branchId
 * so each location gets a different set of cars, but the same location always gets
 * the same set (stable across reloads).
 */
export function getLocationCarImages(branchId: string): string[] {
  if (CAR_IMAGES.length === 0) return [LOCATION_IMAGE_FALLBACK];
  const hash = simpleHash(branchId);
  const count = Math.min(3, Math.max(2, CAR_IMAGES.length));
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = (hash + i * 7) % CAR_IMAGES.length;
    out.push(CAR_IMAGES[index]);
  }
  return out;
}

/**
 * Returns 2–3 image paths for a branch. Kept for API compatibility; uses local car images only.
 */
export function generateLocationImages(
  branchId: string,
  _locationName?: string,
  _branchType?: string,
  _province?: string
): string[] {
  return getLocationCarImages(branchId);
}
