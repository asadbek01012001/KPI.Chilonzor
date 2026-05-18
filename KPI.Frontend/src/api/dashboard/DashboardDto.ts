export interface DateRangeProps {
  readonly from?: string;
  readonly to?: string;
}

export interface MahallaQueryProps extends DateRangeProps {
  readonly region_id?: string;
  readonly sector?: number;
}

export interface TopQueryProps extends DateRangeProps {
  readonly limit?: number;
}

// ── Response types ──────────────────────────────────────

export interface DirectionScoreResponse {
  readonly direction_id: string;
  readonly score: number;
  readonly rank: number;
}

export interface CrimeSummaryResponse {
  readonly total_crimes: number;
  readonly minor_crimes: number;
  readonly medium_crimes: number;
  readonly serious_crimes: number;
  readonly critical_crimes: number;
  readonly total_crimes_score: number;
  readonly minor_crimes_score: number;
  readonly medium_crimes_score: number;
  readonly serious_crimes_score: number;
  readonly critical_crimes_score: number;
}

export interface Emergency102SummaryResponse {
  readonly total_calls_102: number;
  readonly call_pi: number;
  readonly iio_complaint: number;
  readonly calls_102_score: number;
  readonly pi_call_score: number;
  readonly iio_complaint_score: number;
}

export interface MahallaDashboardResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly total_score: number;
  readonly average_rank: number;
  readonly directions: DirectionScoreResponse[];
  readonly crimes: CrimeSummaryResponse;
  readonly emergency102: Emergency102SummaryResponse;
}

export interface MahallaOverviewResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly total_score: number;
  readonly overall_rank: number;
}

export interface TopRegionResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly total_score: number;
  readonly total_crimes?: number;
  readonly total_calls?: number;
}

export interface SectorSummaryResponse {
  readonly sector: number;
  readonly region_count: number;
  readonly kpi_score: number;
  readonly crime_score: number;
  readonly total_crimes: number;
  readonly em_score: number;
  readonly total_calls_102: number;
}

export interface DirectionWithCountResponse {
  readonly direction_id: string;
  readonly direction_name: string;
  readonly indicator_count: number;
}

export interface RegionByDirectionResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly total_score: number;
  readonly rank: number;
}

export interface IndicatorByDirectionRegionResponse {
  readonly indicator_id: string;
  readonly indicator_name: string;
  readonly parent_id: string | null;
  readonly max_score: number;
  readonly achieved_score: number;
  readonly total_value: number;
}

export interface RegionSummaryResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly kpi_total: number;
  readonly crime: {
    readonly total_score: number;
    readonly total_crimes: number;
  };
  readonly emergency102: {
    readonly total_score: number;
    readonly total_calls: number;
  };
  readonly directions: Array<{
    readonly direction_id: string;
    readonly direction_name: string;
    readonly score: number;
  }>;
}
