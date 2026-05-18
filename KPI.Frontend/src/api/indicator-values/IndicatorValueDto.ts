export interface CreateIndicatorValueProps {
  readonly indicator_id: string;
  readonly direction_id: string;
  readonly region_id: string;
  readonly score?: number;
  readonly value?: number | null;
  readonly date: string;
}

export interface UpdateIndicatorValueProps {
  readonly score?: number;
  readonly value?: number;
  readonly date?: string;
}

export interface IndicatorValueQueryProps {
  readonly page?: number;
  readonly limit?: number;
  readonly indicator_id?: string;
  readonly direction_id?: string;
  readonly region_id?: string;
  readonly date?: string;
  readonly from?: string;
  readonly to?: string;
}

export interface IndicatorValueResponse {
  readonly id: string;
  readonly indicator_id: string;
  readonly direction_id: string;
  readonly region_id: string;
  readonly score: number;
  readonly value: number;
  readonly date: string;
  readonly created_at: string;
  readonly updated_at: string;
}
