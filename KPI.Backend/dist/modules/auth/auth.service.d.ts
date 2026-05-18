export declare const authService: {
    register: (name: string, email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("../users/user.entity").UserResponse;
    }>;
    login: (email: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("../users/user.entity").UserResponse;
    }>;
    refresh: (token: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout: (userId: string) => Promise<void>;
    me: (userId: string) => Promise<import("../users/user.entity").UserResponse>;
};
//# sourceMappingURL=auth.service.d.ts.map