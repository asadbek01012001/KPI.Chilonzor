export interface UserResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "user";
  readonly is_active: boolean;
  readonly last_login_at: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly pages: number;
}

export interface PaginatedUsersResponse {
  readonly success: boolean;
  readonly data: UserResponse[];
  readonly meta: PaginationMeta;
}

export interface CreateUserProps {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role?: "admin" | "user";
  readonly is_active?: boolean;
}

export interface UpdateUserProps {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly role?: "admin" | "user";
  readonly is_active?: boolean;
}

export interface GetUsersParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly role?: "admin" | "user" | "";
}
