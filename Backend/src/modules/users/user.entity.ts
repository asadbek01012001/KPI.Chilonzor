export interface User {
  id:            string;
  name:          string;
  email:         string;
  password_hash: string;
  role:          'admin' | 'user';
  is_active:     boolean;
  refresh_token: string | null;
  created_at:    Date;
  updated_at:    Date;
}

export type UserResponse = Omit<User, 'password_hash' | 'refresh_token'>;

export const toUserResponse = (user: User): UserResponse => {
  const { password_hash, refresh_token, ...rest } = user;
  return rest;
};
