import { userRepository } from '../users/user.repository';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';
import { toUserResponse } from '../users/user.entity';

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw AppError.conflict('Email already in use');

    const password_hash = await hashPassword(password);
    const user = await userRepository.create({ name, email, password_hash });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: toUserResponse(user) };
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw AppError.unauthorized('Invalid credentials');
    if (!user.is_active) throw AppError.unauthorized('Account is deactivated');

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw AppError.unauthorized('Invalid credentials');

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: toUserResponse(user) };
  },

  refresh: async (token: string) => {
    let payload;
    try { payload = verifyRefreshToken(token); }
    catch { throw AppError.unauthorized('Invalid refresh token'); }

    const user = await userRepository.findById(payload.userId);
    if (!user || user.refresh_token !== token)
      throw AppError.unauthorized('Refresh token revoked');

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken  = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  },

  logout: async (userId: string) => {
    await userRepository.updateRefreshToken(userId, null);
  },

  me: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return toUserResponse(user);
  },
};
