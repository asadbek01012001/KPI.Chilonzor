export declare const env: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly isDev: boolean;
    readonly db: {
        readonly host: string;
        readonly port: number;
        readonly name: string;
        readonly user: string;
        readonly password: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshSecret: string;
        readonly refreshExpiresIn: string;
    };
    readonly bcryptRounds: number;
};
//# sourceMappingURL=env.d.ts.map