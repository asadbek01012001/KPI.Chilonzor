export interface User {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    is_active: boolean;
    refresh_token: string | null;
    created_at: Date;
    updated_at: Date;
}
export type UserResponse = Omit<User, 'password_hash' | 'refresh_token'>;
export declare const toUserResponse: (user: User) => UserResponse;
//# sourceMappingURL=user.entity.d.ts.map