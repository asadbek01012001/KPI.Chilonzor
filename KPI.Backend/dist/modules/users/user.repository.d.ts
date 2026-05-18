import { User } from './user.entity';
interface FindAllOptions {
    page: number;
    limit: number;
    search?: string;
}
export declare const userRepository: {
    findAll: ({ page, limit, search }: FindAllOptions) => Promise<{
        rows: User[];
        total: number;
    }>;
    findById: (id: string) => Promise<User | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: {
        name: string;
        email: string;
        password_hash: string;
        role?: string;
    }) => Promise<User>;
    update: (id: string, data: Partial<User>) => Promise<User | null>;
    delete: (id: string) => Promise<boolean>;
    updateRefreshToken: (id: string, token: string | null) => Promise<void>;
};
export {};
//# sourceMappingURL=user.repository.d.ts.map