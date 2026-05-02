export interface ReportQueryProps {
  readonly from?: string;
  readonly to?: string;
  readonly region_id?: string;
  readonly sector?: number;
  readonly search?: string | null;
}

export interface ReportExcelProps {
  readonly from?: string;
  readonly to?: string;
  readonly sector?: number;
}

export interface DirectionReportItem {
  readonly direction_id: string;
  readonly score: number;
  readonly rank: number;
}

export interface MahallaReportResponse {
  readonly region_id: string;
  readonly region_name: string;
  readonly sector: number;
  readonly overall_rank: number;
  readonly total_score: number;
  readonly average_rank: number;
  readonly directions: DirectionReportItem[];
  readonly crimes: {
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
  };
  readonly emergency102: {
    readonly total_calls_102: number;
    readonly call_pi: number;
    readonly iio_complaint: number;
    readonly calls_102_score: number;
    readonly pi_call_score: number;
    readonly iio_complaint_score: number;
  };
}
