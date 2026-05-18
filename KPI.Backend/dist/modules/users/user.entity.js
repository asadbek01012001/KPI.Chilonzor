"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = void 0;
const toUserResponse = (user) => {
    const { password_hash, refresh_token, ...rest } = user;
    return rest;
};
exports.toUserResponse = toUserResponse;
//# sourceMappingURL=user.entity.js.map