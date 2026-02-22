export interface VehicleGroup {
  groupCode: string;
  name: string;
  category: string;
  seats: number;
  transmission: "A" | "M";
  luggage: string;
  features?: string[];
  images?: { url: string; alt?: string }[];
}

export type AvailabilityStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";

export interface SearchResultVehicleGroup extends VehicleGroup {
  payLaterPrice: number;
  payNowPrice: number;
  currency: string;
  availabilityStatus?: AvailabilityStatus;
}

export interface VehicleDetail extends VehicleGroup {
  description?: string;
  images: { url: string; alt?: string }[];
  inclusions: string[];
  addOns?: { code: string; name: string; price: number }[];
  availabilityStatus?: AvailabilityStatus;
}
