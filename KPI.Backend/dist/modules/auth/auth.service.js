"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../users/user.repository");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const AppError_1 = require("../../utils/AppError");
const user_entity_1 = require("../users/user.entity");
exports.authService = {
    register: async (name, email, password) => {
        const existing = await user_repository_1.userRepository.findByEmail(email);
        if (existing)
            throw AppError_1.AppError.conflict('Email already in use');
        const password_hash = await (0, hash_1.hashPassword)(password);
        const user = await user_repository_1.userRepository.create({ name, email, password_hash });
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        await user_repository_1.userRepository.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken, user: (0, user_entity_1.toUserResponse)(user) };
    },
    login: async (email, password) => {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user)
            throw AppError_1.AppError.unauthorized('Invalid credentials');
        if (!user.is_active)
            throw AppError_1.AppError.unauthorized('Account is deactivated');
        const valid = await (0, hash_1.comparePassword)(password, user.password_hash);
        if (!valid)
            throw AppError_1.AppError.unauthorized('Invalid credentials');
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        await user_repository_1.userRepository.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken, user: (0, user_entity_1.toUserResponse)(user) };
    },
    refresh: async (token) => {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(token);
        }
        catch {
            throw AppError_1.AppError.unauthorized('Invalid refresh token');
        }
        const user = await user_repository_1.userRepository.findById(payload.userId);
        if (!user || user.refresh_token !== token)
            throw AppError_1.AppError.unauthorized('Refresh token revoked');
        const newPayload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.signAccessToken)(newPayload);
        const refreshToken = (0, jwt_1.signRefreshToken)(newPayload);
        await user_repository_1.userRepository.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    },
    logout: async (userId) => {
        await user_repository_1.userRepository.updateRefreshToken(userId, null);
    },
    me: async (userId) => {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user)
            throw AppError_1.AppError.notFound('User not found');
        return (0, user_entity_1.toUserResponse)(user);
    },
};
//# sourceMappingURL=auth.service.js.map