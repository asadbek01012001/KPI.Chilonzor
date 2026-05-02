export interface CreateDirectionProps {
  readonly name: string;
}

export interface UpdateDirectionProps {
  readonly name?: string;
}

export interface DirectionResponse {
  readonly id: string;
  readonly name: string;
  readonly created_at: string;
  readonly updated_at: string;
}
