export interface CreateIndicatorProps {
  readonly direction_id: string;
  readonly parent_id?: string;
  readonly name: string;
  readonly score?: number;
  readonly is_subtraction?: boolean;
  readonly index?: number;
}

export interface UpdateIndicatorProps {
  readonly direction_id?: string;
  readonly parent_id?: string;
  readonly name?: string;
  readonly score?: number;
  readonly is_subtraction?: boolean;
}

export interface IndicatorQueryProps {
  readonly page?: number;
  readonly limit?: number;
  readonly direction_id?: string;
  readonly parent_id?: string;
}

export interface IndicatorResponse {
  readonly id: string;
  readonly direction_id: string;
  readonly parent_id: string | null;
  readonly name: string;
  readonly score: number;
  readonly created_at: string;
  readonly updated_at: string;
}
