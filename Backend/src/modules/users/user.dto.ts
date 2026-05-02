import { z } from 'zod';

export const CreateUserSchema = z.object({
  name:     z.string().min(1, 'Name is required').max(100).trim(),
  email:    z.string().email('Valid email required').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['admin', 'user']).optional(),
});

export const UpdateUserSchema = z.object({
  name:      z.string().min(1).max(100).trim().optional(),
  email:     z.string().email().trim().optional(),
  password:  z.string().min(6).optional(),
  role:      z.enum(['admin', 'user']).optional(),
  is_active: z.boolean().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });

export const UserPaginationSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
