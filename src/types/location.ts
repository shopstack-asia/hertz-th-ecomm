export interface Location {
  code: string;
  name: string;
  address?: string;
  city?: string;
}

export interface LocationSearchParams {
  q?: string;
}
