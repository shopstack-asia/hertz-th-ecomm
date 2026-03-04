/**
 * Returns the location-type image path for a branch based on branch_type and name.
 * Images are in /public/location-types/: airport.png, downtown.png, mall.png, beach.png.
 */
export function getLocationImage(branchType: string, branchName: string): string {
  const name = branchName.toLowerCase();

  // beach locations (by name)
  if (
    name.includes("patong") ||
    name.includes("kata") ||
    name.includes("chaweng") ||
    name.includes("ao nang")
  ) {
    return "/location-types/beach.png";
  }

  if (branchType === "Airport") {
    return "/location-types/airport.png";
  }

  if (branchType === "Mall") {
    return "/location-types/mall.png";
  }

  return "/location-types/downtown.png";
}
