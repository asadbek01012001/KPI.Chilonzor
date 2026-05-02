export interface UpdateUserProps {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
}

export interface UserResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "user";
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface UserListResponse {
  readonly success: boolean;
  readonly data: UserResponse[];
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
  readonly role?: "admin" | "user";
  readonly is_active?: boolean;
}