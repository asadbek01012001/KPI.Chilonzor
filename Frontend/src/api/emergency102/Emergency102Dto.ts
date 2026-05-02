export interface CreateEmergency102Props {
  readonly region_id: string;
  readonly total_calls_102?: number;
  readonly call_pi?: number;
  readonly iio_complaint?: number;
  readonly calls_102_score?: number;
  readonly pi_call_score?: number;
  readonly iio_complaint_score?: number;
  readonly date?: string;
}

export interface UpdateEmergency102Props {
  readonly total_calls_102?: number;
  readonly call_pi?: number;
  readonly iio_complaint?: number;
  readonly calls_102_score?: number;
  readonly pi_call_score?: number;
  readonly iio_complaint_score?: number;
  readonly date?: string;
}

export interface Emergency102QueryProps {
  readonly page?: number;
  readonly limit?: number;
  readonly region_id?: string;
  readonly date?: string;
  readonly from?: string;
  readonly to?: string;
}

export interface Emergency102Response {
  readonly id: string;
  readonly region_id: string;
  readonly total_calls_102: number;
  readonly call_pi: number;
  readonly iio_complaint: number;
  readonly calls_102_score: number;
  readonly pi_call_score: number;
  readonly iio_complaint_score: number;
  readonly date: string;
  readonly created_at: string;
  readonly updated_at: string;
}
