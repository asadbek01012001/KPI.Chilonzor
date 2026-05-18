"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("./user.repository");
const user_entity_1 = require("./user.entity");
const hash_1 = require("../../utils/hash");
const AppError_1 = require("../../utils/AppError");
const response_1 = require("../../utils/response");
exports.userService = {
    getAll: async (page, limit, search) => {
        const { rows, total } = await user_repository_1.userRepository.findAll({ page, limit, search });
        return { data: rows.map(user_entity_1.toUserResponse), meta: (0, response_1.paginate)(total, page, limit) };
    },
    getById: async (id) => {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user)
            throw AppError_1.AppError.notFound(`User ${id} not found`);
        return (0, user_entity_1.toUserResponse)(user);
    },
    create: async (dto) => {
        const existing = await user_repository_1.userRepository.findByEmail(dto.email);
        if (existing)
            throw AppError_1.AppError.conflict('Email already in use');
        const password_hash = await (0, hash_1.hashPassword)(dto.password);
        const user = await user_repository_1.userRepository.create({
            name: dto.name, email: dto.email, password_hash, role: dto.role,
        });
        return (0, user_entity_1.toUserResponse)(user);
    },
    update: async (id, dto, requesterId, requesterRole) => {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user)
            throw AppError_1.AppError.notFound(`User ${id} not found`);
        // Only admin or the owner can update
        if (requesterRole !== 'admin' && id !== requesterId)
            throw AppError_1.AppError.forbidden('You can only update your own profile');
        // Only admin can change role
        if (dto.role && requesterRole !== 'admin')
            throw AppError_1.AppError.forbidden('Only admin can change roles');
        const updateData = {};
        if (dto.name)
            updateData.name = dto.name;
        if (dto.email) {
            const existing = await user_repository_1.userRepository.findByEmail(dto.email);
            if (existing && existing.id !== id)
                throw AppError_1.AppError.conflict('Email already in use');
            updateData.email = dto.email;
        }
        if (dto.password)
            updateData.password_hash = await (0, hash_1.hashPassword)(dto.password);
        if (dto.role)
            updateData.role = dto.role;
        if (dto.is_active !== undefined)
            updateData.is_active = dto.is_active;
        const updated = await user_repository_1.userRepository.update(id, updateData);
        if (!updated)
            throw AppError_1.AppError.notFound(`User ${id} not found`);
        return (0, user_entity_1.toUserResponse)(updated);
    },
    delete: async (id, requesterId, requesterRole) => {
        if (requesterRole !== 'admin' && id !== requesterId)
            throw AppError_1.AppError.forbidden('Access denied');
        const deleted = await user_repository_1.userRepository.delete(id);
        if (!deleted)
            throw AppError_1.AppError.notFound(`User ${id} not found`);
    },
};
//# sourceMappingURL=user.service.js.map