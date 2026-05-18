import { PoolClient } from 'pg';
export declare const db: {
    query: <T = unknown>(text: string, params?: unknown[]) => Promise<import("pg").QueryResult<T & Record<string, unknown>>>;
    getClient: () => Promise<PoolClient>;
    transaction: <T>(fn: (client: PoolClient) => Promise<T>) => Promise<T>;
};
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map