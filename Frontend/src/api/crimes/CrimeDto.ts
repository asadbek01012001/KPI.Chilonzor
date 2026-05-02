export interface CreateCrimeProps {
  readonly region_id: string;
  readonly total_crimes?: number;
  readonly minor_crimes?: number;
  readonly medium_crimes?: number;
  readonly serious_crimes?: number;
  readonly critical_crimes?: number;
  readonly total_crimes_score?: number;
  readonly minor_crimes_score?: number;
  readonly medium_crimes_score?: number;
  readonly serious_crimes_score?: number;
  readonly critical_crimes_score?: number;
  readonly date?: string;
}

export interface UpdateCrimeProps {
  readonly total_crimes?: number;
  readonly minor_crimes?: number;
  readonly medium_crimes?: number;
  readonly serious_crimes?: number;
  readonly critical_crimes?: number;
  readonly total_crimes_score?: number;
  readonly minor_crimes_score?: number;
  readonly medium_crimes_score?: number;
  readonly serious_crimes_score?: number;
  readonly critical_crimes_score?: number;
  readonly date?: string;
}

export interface CrimeQueryProps {
  readonly page?: number;
  readonly limit?: number;
  readonly region_id?: string;
  readonly date?: string;
  readonly from?: string;
  readonly to?: string;
}

export interface CrimeResponse {
  readonly id: string;
  readonly region_id: string;
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
  readonly date: string;
  readonly created_at: string;
  readonly updated_at: string;
}
