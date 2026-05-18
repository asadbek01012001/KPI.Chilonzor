"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const pool = new pg_1.Pool({
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    database: env_1.env.db.name,
    user: env_1.env.db.user,
    password: env_1.env.db.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on('error', (err) => {
    logger_1.logger.error('Unexpected DB pool error', err);
});
exports.db = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
    transaction: async (fn) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await fn(client);
            await client.query('COMMIT');
            return result;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    },
};
const connectDB = async () => {
    const client = await pool.connect();
    client.release();
    logger_1.logger.info('PostgreSQL connected');
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map