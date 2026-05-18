export interface LoginProps {
  readonly email: string;
  readonly password: string;
}

export interface RegisterProps {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface RefreshTokenProps {
  readonly refreshToken: string;
}

export interface AuthResponse {
  readonly success: boolean;
  readonly data: {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly user: UserResponse;
  };
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
