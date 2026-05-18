export interface CreateRegionProps {
  readonly name: string;
  readonly sector: number;
}

export interface UpdateRegionProps {
  readonly name?: string;
  readonly sector?: number;
}

export interface RegionResponse {
  readonly id: string;
  readonly name: string;
  readonly sector: number;
  readonly created_at: string;
  readonly updated_at: string;
}
