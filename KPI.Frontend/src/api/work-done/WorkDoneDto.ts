export interface WorkDoneQueryProps {
  readonly from?: string;
  readonly to?: string;
}

export interface RegionScoreItem {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly score: number;
  readonly value: number;
}

export interface WorkDoneIndicatorResponse {
  readonly indicator_id: string;
  readonly indicator_name: string;
  readonly parent_id: string | null;
  readonly max_score: number;
  readonly regions: RegionScoreItem[];
}

export interface WorkDoneIndicatorDetailResponse {
  readonly indicator_id: string;
  readonly indicator_name: string;
  readonly parent_id: string | null;
  readonly max_score: number;
  readonly regions: RegionScoreItem[];
}
