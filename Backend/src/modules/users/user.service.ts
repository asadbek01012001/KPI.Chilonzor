import { userRepository } from './user.repository';
import { toUserResponse, UserResponse } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';
import { paginate, PaginationMeta } from '../../utils/response';

export const userService = {
  getAll: async (
    page: number, limit: number, search?: string
  ): Promise<{ data: UserResponse[]; meta: PaginationMeta }> => {
    const { rows, total } = await userRepository.findAll({ page, limit, search });
    return { data: rows.map(toUserResponse), meta: paginate(total, page, limit) };
  },

  getById: async (id: string): Promise<UserResponse> => {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound(`User ${id} not found`);
    return toUserResponse(user);
  },

  create: async (dto: CreateUserDto): Promise<UserResponse> => {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw AppError.conflict('Email already in use');

    const password_hash = await hashPassword(dto.password);
    const user = await userRepository.create({
      name: dto.name, email: dto.email, password_hash, role: dto.role,
    });
    return toUserResponse(user);
  },

  update: async (id: string, dto: UpdateUserDto, requesterId: string, requesterRole: string): Promise<UserResponse> => {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound(`User ${id} not found`);

    // Only admin or the owner can update
    if (requesterRole !== 'admin' && id !== requesterId)
      throw AppError.forbidden('You can only update your own profile');

    // Only admin can change role
    if (dto.role && requesterRole !== 'admin')
      throw AppError.forbidden('Only admin can change roles');

    const updateData: Partial<typeof user> = {};
    if (dto.name)      updateData.name      = dto.name;
    if (dto.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) throw AppError.conflict('Email already in use');
      updateData.email = dto.email;
    }
    if (dto.password)  updateData.password_hash = await hashPassword(dto.password);
    if (dto.role)      updateData.role      = dto.role;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

    const updated = await userRepository.update(id, updateData);
    if (!updated) throw AppError.notFound(`User ${id} not found`);
    return toUserResponse(updated);
  },

  delete: async (id: string, requesterId: string, requesterRole: string): Promise<void> => {
    if (requesterRole !== 'admin' && id !== requesterId)
      throw AppError.forbidden('Access denied');

    const deleted = await userRepository.delete(id);
    if (!deleted) throw AppError.notFound(`User ${id} not found`);
  },
};
