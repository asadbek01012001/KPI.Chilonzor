"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const hashPassword = (plain) => bcryptjs_1.default.hash(plain, env_1.env.bcryptRounds);
exports.hashPassword = hashPassword;
const comparePassword = (plain, hashed) => bcryptjs_1.default.compare(plain, hashed);
exports.comparePassword = comparePassword;
//# sourceMappingURL=hash.js.map